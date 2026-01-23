// src/services/server/course.server.ts

import dbConnect from "@/lib/mongodb";
import Course from "@/models/mongoose/Course.schema";
import SubExam from "@/models/mongoose/SubExam.schema";
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
  if (!subExamSlug) {
    throw BadRequest("subExamSlug is required");
  }

  const lang = getCurrentLang();
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
      {
        $or: [{ validFrom: null }, { validFrom: { $lte: now } }],
      },
      {
        $or: [{ validTo: null }, { validTo: { $gte: now } }],
      },
    ],
  })
    .sort({ createdAt: -1 })
    .lean();

  return courses.map((course) => mapCourseDTO(course, lang));
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
