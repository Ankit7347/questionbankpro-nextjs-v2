// src/services/server/examCourse.server.ts

import dbConnect from "@/lib/mongodb";
import Exam from "@/models/mongoose/Exam.schema";
import Course from "@/models/mongoose/Course.schema";
import Subject from "@/models/mongoose/Subject.schema";
import { mapExamCourseOverviewDTO } from "@/models/dto/examCourse.mapper";

export async function getExamCourseOverview(
  examSlug: string,
  courseSlug: string,
  lang: "en" | "hi"
) {
  await dbConnect();

  const exam = await Exam.findOne({
    slug: examSlug,
    isDeleted: false,
  }).lean();

  if (!exam) return null;

  const course = await Course.findOne({
    slug: courseSlug,
    examId: exam._id,
    isActive: true,
    isDeleted: false,
  }).lean();

  if (!course) return null;

  const subjects = await Subject.find({
    courseId: course._id,
    isActive: true,
    isDeleted: false,
  })
    .sort({ order: 1 })
    .lean();

  return mapExamCourseOverviewDTO(
    exam,
    course,
    subjects,
    lang
  );
}
