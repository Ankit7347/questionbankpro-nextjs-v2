// src/services/server/course.server.ts

import dbConnect from "@/lib/mongodb";
import Course from "@/models/mongoose/Course.schema";
import SubExam from "@/models/mongoose/SubExam.schema";
import { mapCourseAccessDTO } from "@/models/dto/courseAccess.mapper";
import Exam from "@/models/mongoose/Exam.schema";

import { getCurrentLang } from "@/lib/i18n";
import {
  BadRequest,
  NotFound,
} from "@/lib/apiError";
import { mapCourseDTO } from "@/models/dto/course.mapper";

/* =========================================================
   LIST ALL COURSES (Admin)
========================================================= */
export async function listCourses() {
  const lang = getCurrentLang();
  await dbConnect();

  const courses = await Course.find({
    isDeleted: false,
  })
    .sort({ createdAt: -1 })
    .lean();

  return courses.map((course) => mapCourseDTO(course, lang));
}

/* =========================================================
   CREATE COURSE (Admin)
========================================================= */
export async function createCourse(payload: any) {
  const lang = getCurrentLang();
  await dbConnect();

  if (!payload?.subExamId) {
    throw BadRequest("subExamId is required");
  }

  const subExamExists = await SubExam.exists({
    _id: payload.subExamId,
    isDeleted: false,
  });

  if (!subExamExists) {
    throw NotFound("SubExam not found");
  }

  const course = await Course.create(payload);
  return mapCourseDTO(course.toObject(), lang);
}

/* =========================================================
   GET COURSE BY ID (Admin)
========================================================= */
export async function getCourseById(courseId: string) {
  const lang = getCurrentLang();
  await dbConnect();

  const course = await Course.findOne({
    _id: courseId,
    isDeleted: false,
  }).lean();

  if (!course) {
    throw NotFound("Course not found");
  }

  return mapCourseDTO(course, lang);
}

/* =========================================================
   UPDATE COURSE (Admin)
========================================================= */
export async function updateCourseById(
  courseId: string,
  payload: any
) {
  const lang = getCurrentLang();
  await dbConnect();

  const course = await Course.findOneAndUpdate(
    { _id: courseId, isDeleted: false },
    { $set: payload },
    { new: true }
  ).lean();

  if (!course) {
    throw NotFound("Course not found");
  }

  return mapCourseDTO(course, lang);
}

/* =========================================================
   DELETE COURSE (Soft Delete)
========================================================= */
export async function deleteCourseById(courseId: string) {
  await dbConnect();

  const course = await Course.findOneAndUpdate(
    { _id: courseId, isDeleted: false },
    { $set: { isDeleted: true } },
    { new: true }
  ).lean();

  if (!course) {
    throw NotFound("Course not found");
  }

  return { id: courseId };
}

/* =========================================================
   LIST COURSES BY SUBEXAM (Public / Student)
========================================================= */
export async function listCoursesBySubExam(
  subExamSlug: string | null
) {
  const lang = getCurrentLang();
  if (!subExamSlug) {
    throw BadRequest("subExamSlug is required");
  }

  await dbConnect();

  const subExam = await SubExam.findOne({
    slug: subExamSlug,
    isActive: true,
    isDeleted: false,
  }).lean();

  if (!subExam) {
    throw NotFound("SubExam not found");
  }

  const now = new Date();

  const courses = await Course.find({
    subExamId: subExam._id,
    isActive: true,
    visibility: "PUBLIC",
    isDeleted: false,
    $and: [
      { $or: [{ validFrom: null }, { validFrom: { $lte: now } }] },
      { $or: [{ validTo: null }, { validTo: { $gte: now } }] },
    ],
  })
    .sort({ createdAt: -1 })
    .lean();

  // ✅ RETURN ACCESS-AWARE SHAPE
  return courses.map((course) => mapCourseAccessDTO(course, lang));
}


/* =========================================================
   TOGGLE COURSE ACTIVE (Operational Kill Switch)
========================================================= */
export async function toggleCourseActive(payload: {
  courseId: string;
  isActive: boolean;
}) {
  await dbConnect();

  const { courseId, isActive } = payload;

  if (!courseId) {
    throw BadRequest("courseId is required");
  }

  const course = await Course.findOneAndUpdate(
    { _id: courseId, isDeleted: false },
    { $set: { isActive } },
    { new: true }
  ).lean();

  if (!course) {
    throw NotFound("Course not found");
  }

  return {
    id: courseId,
    isActive: course.isActive,
  };
}
/* =========================================================
   DASHBOARD → COURSES (Student)
   Domain-level aggregation
========================================================= */

import UserCourseAccess from "@/models/mongoose/UserCourseAccess.schema";
import { DashboardCoursesDTO } from "@/models/dto/course.dto";

export async function getDashboardCourses(): Promise<DashboardCoursesDTO> {
  const userId= "69738bce5ccf5655b013cfba";
  const subExamSlug ="gate-2026-cs-it";
  if (!userId || !subExamSlug) {
    throw BadRequest("Invalid request");
  }


  const lang = getCurrentLang();
  await dbConnect();

  /* --------------------------------
     Resolve SubExam
  --------------------------------- */
  const subExam = await SubExam.findOne({
    slug: subExamSlug,
    isDeleted: false,
  }).lean();

  if (!subExam) {
    throw NotFound("SubExam not found");
  }
  /* --------------------------------
   Resolve Exam
--------------------------------- */
  const exam = await Exam.findById(subExam.examId)
    .select("slug")
    .lean();

  if (!exam) {
    throw NotFound("Exam not found");
  }
  /* --------------------------------
     Fetch user access
  --------------------------------- */
  const accesses = await UserCourseAccess.find({
    userId,
    subExamId: subExam._id,
    isDeleted: false,
  }).lean();

  const accessMap = new Map(
    accesses.map((a) => [a.courseId.toString(), a])
  );

  /* --------------------------------
     Fetch courses
  --------------------------------- */
  const courses = await Course.find({
    subExamId: subExam._id,
    isActive: true,
    visibility: "PUBLIC",
    isDeleted: false,
  }).lean();

  /* --------------------------------
     DTO container (STRICT)
  --------------------------------- */
  const result: DashboardCoursesDTO = {
    context: {
      examSlug: exam.slug,
      subExamSlug: subExam.slug,
    },
    myCourses: {
      active: [],
      expiring: [],
      expired: [],
    },
    explore: {
      free: [],
      paid: [],
    },
  };

  const now = new Date();

  for (const course of courses) {
    const access = accessMap.get(course._id.toString());

    // ✅ ONLY mapper output
    const dto = mapCourseAccessDTO(course, lang, access);

    /* ----------------------------
       Explore (not enrolled)
    ----------------------------- */
    if (!access) {
      dto.flags.isFree
        ? result.explore.free.push(dto)
        : result.explore.paid.push(dto);
      continue;
    }

    /* ----------------------------
       Lifetime / Free
    ----------------------------- */
    if (access.accessType === "FREE" || !access.accessValidTill) {
      result.myCourses.active.push(dto);
      continue;
    }

    /* ----------------------------
       Time-based access
    ----------------------------- */
    const diffDays =
      (access.accessValidTill.getTime() - now.getTime()) /
      (1000 * 60 * 60 * 24);

    if (diffDays <= 0) {
      result.myCourses.expired.push(dto);
    } else if (diffDays <= 7) {
      result.myCourses.expiring.push(dto);
    } else {
      result.myCourses.active.push(dto);
    }
  }

  return result;
}
