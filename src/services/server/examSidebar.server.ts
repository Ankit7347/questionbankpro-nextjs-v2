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
  courseSlug: string,
  year?: number
) {
  const lang = getCurrentLang();

  /** 1. Exam */
  const exam = await Exam.findOne({
    slug: examSlug,
    isDeleted: false,
  }).lean();

  if (!exam) throw NotFound("Exam not found");

  /** 2. Course */
  const course = await Course.findOne({
    slug: courseSlug,
    examId: exam._id,
    isDeleted: false,
  }).lean();

  if (!course) throw NotFound("Course not found");

  /** 3. Active syllabus (year-aware) */
  const syllabus = await Syllabus.findOne({
    examId: exam._id,
    courseId: course._id,
    ...(year ? { year } : {}),
    isActive: true,
    isDeleted: false,
  }).lean();

  if (!syllabus) throw NotFound("Syllabus not found");

  /** 4. Subjects (syllabus scoped) */
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

  /** 5. Chapters (syllabus + subject scoped) */
  const subjectIds = subjects.map((s) => s._id);

  const chapters = await Chapter.find({
    syllabusId: syllabus._id,
    subjectId: { $in: subjectIds },
    isDeleted: false,
  })
    .select("slug name order subjectId")
    .sort({ order: 1 })
    .lean();

  /** 6. Attach chapters to subjects */
  const subjectMap = subjects.map((subject) => ({
    ...subject,
    chapters: chapters.filter(
      (chapter) => chapter.subjectId.toString() === subject._id.toString()
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
