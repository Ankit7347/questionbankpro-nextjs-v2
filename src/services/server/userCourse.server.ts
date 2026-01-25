// src/services/server/userCourse.server.ts

import dbConnect from "@/lib/mongodb";
import UserCourseAccess from "@/models/mongoose/UserCourseAccess.schema";
import Course from "@/models/mongoose/Course.schema";
import { mapCourseAccessDTO } from "@/models/dto/courseAccess.mapper";
import { NotFound } from "@/lib/apiError";
import SubExam from "@/models/mongoose/SubExam.schema";
import Exam from "@/models/mongoose/Exam.schema";
import { getCurrentLang } from "@/lib/i18n";

/* =========================================================
   GET USER ENROLLED COURSES
   Server-side access projection
========================================================= */

export async function getUserCourses(userId: string) {
  if (!userId) {
    throw NotFound("User not authenticated");
  }

  await dbConnect();

  /* --------------------------------
     1. Fetch ACTIVE access records
  --------------------------------- */
  const accesses = await UserCourseAccess.find({
    userId,
    status: "ACTIVE",
    isDeleted: false,
  }).lean();

  if (accesses.length === 0) {
    return [];
  }

  const courseIds = accesses.map((a) => a.courseId);
  const subExamIds = accesses.map((a) => a.subExamId);

  /* --------------------------------
     2. Fetch courses
  --------------------------------- */
  const courses = await Course.find({
    _id: { $in: courseIds },
    isDeleted: false,
  }).lean();

  /* --------------------------------
     3. Fetch SubExam + Exam
  --------------------------------- */
  const subExams = await SubExam.find({
    _id: { $in: subExamIds },
    isDeleted: false,
  })
    .select("_id slug examId")
    .lean();

  const examIds = subExams.map((s) => s.examId);

  const exams = await Exam.find({
    _id: { $in: examIds },
    isDeleted: false,
  })
    .select("_id slug")
    .lean();

  /* Quick lookup maps */
  const subExamMap = new Map(
    subExams.map((s) => [s._id.toString(), s])
  );

  const examMap = new Map(
    exams.map((e) => [e._id.toString(), e])
  );

  /* --------------------------------
     4. Map Course + Access + Slugs
  --------------------------------- */
  const lang = getCurrentLang();

  return courses.map((course) => {
    const access = accesses.find(
      (a) => a.courseId.toString() === course._id.toString()
    );

    const subExam = subExamMap.get(access.subExamId.toString());
    const exam = examMap.get(subExam.examId.toString());

    const dto = mapCourseAccessDTO(course, lang, access);

    // Inject path information
    return {
      ...dto,
      examSlug: exam.slug,
      subExamSlug: subExam.slug,
    };
  });
}

