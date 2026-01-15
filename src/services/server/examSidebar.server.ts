/**
 * src/services/server/examSidebar.server.ts
 */

import Exam from "@/models/mongoose/Exam.schema";
import Course from "@/models/mongoose/Course.schema";
import Syllabus from "@/models/mongoose/Syllabus.schema";
import Subject from "@/models/mongoose/Subject.schema";
import Chapter from "@/models/mongoose/Chapter.schema";
import { NotFound } from "@/lib/apiError";
import { mapExamSidebar } from "@/models/dto/examSidebar.mapper";
import { getCurrentLang } from "@/lib/i18n";

export async function getExamSidebarServer(
  examSlug: string,
  courseSlug?: string,
  year?: number
) {
  const lang = getCurrentLang();
  const effectiveYear = year ?? new Date().getFullYear();

  /** 1. Exam (MANDATORY) */
  const exam = await Exam.findOne({
    slug: examSlug,
    isDeleted: false,
  }).lean();

  if (!exam) throw NotFound("Exam not found");

  /** 2. Course (MANDATORY) */
  const course = await Course.findOne({
    slug: courseSlug,
    examId: exam._id,
    isDeleted: false,
  }).lean();

  if (!course) throw NotFound("Course not found");

  /** 3. Syllabus (OPTIONAL) */
  const syllabus = await Syllabus.findOne({
    courseId: course._id,
    // isActive: true,
    isDeleted: false,
    validFrom: { $lte: effectiveYear },
    $or: [
      { validTo: null },
      { validTo: { $gte: effectiveYear } },
    ],
  })
    .sort({ validFrom: -1 })
    .lean();

  // If syllabus missing → return empty sidebar
  if (!syllabus) {
    return mapExamSidebar({
      exam,
      course,
      syllabus: null,
      subjects: [],
      lang,
    });
  }

  /** 4. Subjects (OPTIONAL) */
  const subjects = await Subject.find({
    syllabusId: syllabus._id,
    isDeleted: false,
  })
    .select("slug name order")
    .sort({ order: 1 })
    .lean();

  if (!subjects.length) {
    return mapExamSidebar({
      exam,
      course,
      syllabus,
      subjects: [],
      lang,
    });
  }

  /** 5. Chapters (OPTIONAL) */
  const subjectIds = subjects.map((s) => s._id);

  const chapters = await Chapter.find({
    syllabusId: syllabus._id,
    subjectId: { $in: subjectIds },
    isDeleted: false,
  })
    .select("slug name order subjectId")
    .sort({ order: 1 })
    .lean();

  /** 6. Attach chapters safely */
  const subjectMap = subjects.map((subject) => ({
    ...subject,
    chapters: chapters.filter(
      (chapter) =>
        chapter.subjectId.toString() === subject._id.toString()
    ),
  }));

  return mapExamSidebar({
    exam,
    course,
    syllabus,
    subjects: subjectMap,
    lang,
  });
}
