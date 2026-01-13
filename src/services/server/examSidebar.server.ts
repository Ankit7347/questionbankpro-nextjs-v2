/**
 * src/services/server/examSidebar.server.ts
 */

import Exam from "@/models/mongoose/Exam.schema";
import Course from "@/models/mongoose/Course.schema";
import Subject from "@/models/mongoose/Subject.schema";
import { NotFound } from "@/lib/apiError";
import { mapExamSidebar } from "@/models/dto/examSidebar.mapper";
import { getCurrentLang } from "@/lib/i18n";

export async function getExamSidebarServer(
  examSlug: string,
  courseSlug: string
) {
  const lang = getCurrentLang();

  const exam = await Exam.findOne({
    slug: examSlug,
    isDeleted: false,
  });

  if (!exam) {
    throw NotFound("Exam not found");
  }

  const course = await Course.findOne({
    slug: courseSlug,
    examId: exam._id,
    isDeleted: false,
  });

  if (!course) {
    throw NotFound("Course not found");
  }

  const subjects = await Subject.find({
    course: course._id,
    isDeleted: false,
  })
    .populate({
      path: "chapters",
      match: { isDeleted: false },
      select: "slug name",
    })
    .select("slug name chapters")
    .lean();

  return mapExamSidebar(exam, course, subjects, lang);
}
