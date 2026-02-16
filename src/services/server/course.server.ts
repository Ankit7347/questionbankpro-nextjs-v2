// src/services/server/course.server.ts
import { auth } from "@/lib/auth";

import dbConnect from "@/lib/mongodb";
import Course from "@/models/mongoose/Course.schema";
import SubExam from "@/models/mongoose/SubExam.schema";
import { mapCourseAccessDTO } from "@/models/dto/courseAccess.mapper";
import Exam from "@/models/mongoose/Exam.schema";
import User from "@/models/mongoose/User.schema";

import { getCurrentLang } from "@/lib/i18n";
import {
  BadRequest,
  NotFound,
} from "@/lib/apiError";
import { mapCourseCheckoutDTO, mapCourseDTO } from "@/models/dto/course.mapper";

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
   GET COURSE BY SLUG (Admin)
========================================================= */
export async function getCourseBySlug(slug: string): Promise<CourseCheckoutData> {
  // 1. Get current language (ensure this helper is imported)
  const lang = getCurrentLang();
  await dbConnect();

  // 2. Use findOne to get the raw course document
  const course = await Course.findOne({
    slug,
    isDeleted: { $ne: true }
  }).lean();

  if (!course) {
    throw new Error("Course not found");
  }

  // 3. Pass the single object to the mapper
  return mapCourseCheckoutDTO(course, lang);
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
import { CourseCheckoutData } from "@/dto/course.ui.dto";

export async function getDashboardCourses(): Promise<DashboardCoursesDTO> {

  const lang = getCurrentLang();
  await dbConnect();
  const session = await auth();

  const userUuid = session?.user?.id;
  const subExamId = session?.user?.subExamId;
  if (!userUuid) {
    throw NotFound("User not authenticated");
  }
  /* --------------------------------
     Resolve User (UUID -> _id)
  --------------------------------- */
  const user = await User.findOne({
    uuid: userUuid,
    isDeleted: false,
  }).select("_id");

  if (!user) {
    throw NotFound("User not found");
  }

  /* --------------------------------
     Resolve SubExam
  --------------------------------- */
  const subExam = await SubExam.findOne({
    _id: subExamId,
    isActive: true,
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
    userId: user._id,
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
    const isWithinFreeWindow =
      (!course.validFrom || course.validFrom <= now) &&
      (!course.validTo || course.validTo >= now);

    const isCatalogFree =
      course.isGloballyFree === true && isWithinFreeWindow;

    /* ----------------------------
       Explore (not enrolled)
    ----------------------------- */
    if (!access) {
      if (isCatalogFree) {
        dto.flags.isFree = true; // catalog-level free
        result.explore.free.push(dto);
      } else {
        result.explore.paid.push(dto);
      }
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
