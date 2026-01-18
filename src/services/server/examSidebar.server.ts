/**
 * src/services/server/examSidebar.server.ts
 */

import Exam from "@/models/mongoose/Exam.schema";
import Course from "@/models/mongoose/Course.schema";
import Syllabus from "@/models/mongoose/Syllabus.schema";
import Subject from "@/models/mongoose/Subject.schema";
import Chapter from "@/models/mongoose/Chapter.schema";
import SubjectMap from "@/models/mongoose/SubjectMap.schema";
import ChapterMap from "@/models/mongoose/ChapterMap.schema";

import { NotFound } from "@/lib/apiError";
import { mapExamSidebar } from "@/models/dto/examSidebar.mapper";
import { getCurrentLang } from "@/lib/i18n";
import dbConnect from "@/lib/mongodb";

export async function getExamSidebarServer(examSlug: string,courseSlug:string) {
  const lang = getCurrentLang();
  await dbConnect();
  /** 1️⃣ Exam (MANDATORY) */
  const exam = await Exam.findOne({
    slug: examSlug,
    isDeleted: false,
  }).lean();

  if (!exam) throw NotFound("Exam not found");

  /** 2️⃣ Course (MANDATORY – resolved internally) */
  const course = await Course.findOne({
    examId: exam._id,
    slug: courseSlug,
    isDeleted: false,
  })
    .sort({ createdAt: 1 }) // first/default course
    .lean();

  if (!course) throw NotFound("Course not found");

  /** 3️⃣ Active Syllabus (MANDATORY boundary) */
  const syllabus = await Syllabus.findOne({
    courseId: course._id,
    isActive: true,
    isDeleted: false,
  }).lean();

  // No active syllabus → empty sidebar (valid state)
  if (!syllabus) {
    return mapExamSidebar({
      exam,
      course,
      syllabus: null,
      subjects: [],
      lang,
    });
  }

  /** 4️⃣ SubjectMap (STRUCTURE ENTRY POINT) */
  const subjectMaps = await SubjectMap.find({
    syllabusId: syllabus._id,
    isDeleted: false,
    isRemoved: false,
  })
    .sort({ order: 1 })
    .lean();

  if (!subjectMaps.length) {
    return mapExamSidebar({
      exam,
      course,
      syllabus,
      subjects: [],
      lang,
    });
  }

  /** 5️⃣ Subjects (CONTENT) */
  const subjectIds = subjectMaps.map((sm) => sm.subjectId);

  const subjects = await Subject.find({
    _id: { $in: subjectIds },
    isDeleted: false,
  }).lean();

  const subjectById = new Map(
    subjects.map((s) => [s._id.toString(), s])
  );

  /** 6️⃣ ChapterMap */
  const subjectMapIds = subjectMaps.map((sm) => sm._id);

  const chapterMaps = await ChapterMap.find({
    subjectMapId: { $in: subjectMapIds },
    isDeleted: false,
    isRemoved: false,
  })
    .sort({ order: 1 })
    .lean();

  /** 7️⃣ Chapters (CONTENT) */
  const chapterIds = chapterMaps.map((cm) => cm.chapterId);

  const chapters = await Chapter.find({
    _id: { $in: chapterIds },
    isDeleted: false,
  }).lean();

  const chapterById = new Map(
    chapters.map((c) => [c._id.toString(), c])
  );

  /** 8️⃣ Build sidebar tree (SAFE & YEAR-ISOLATED) */
  const subjectsTree = subjectMaps.map((sm) => {
    const subject = subjectById.get(sm.subjectId.toString());

    if (!subject) return null;

    const chaptersForSubject = chapterMaps
      .filter(
        (cm) =>
          cm.subjectMapId.toString() === sm._id.toString()
      )
      .map((cm) => {
        const chapter = chapterById.get(
          cm.chapterId.toString()
        );
        if (!chapter) return null;

        return {
          ...chapter,
          order: cm.order,
        };
      })
      .filter(Boolean);

    return {
      ...subject,
      order: sm.order,
      chapters: chaptersForSubject,
    };
  }).filter(Boolean);

  /** 9️⃣ Final DTO mapping */
  return mapExamSidebar({
    exam,
    course,
    syllabus,
    subjects: subjectsTree,
    lang,
  });
}
