/**
 * src/models/dto/examSidebar.mapper.ts
 */

import { ExamSidebarServerDto } from "./examSidebar.dto";
import { mapBaseFields } from "./base.mapper";
import { Lang, resolveI18nField } from "@/lib/i18n";

interface MapExamSidebarInput {
  exam: any;
  subExam: any;
  syllabus?: any | null;
  subjects: any[];
  lang: Lang;
}

export function mapExamSidebar({
  exam,
  subExam,
  syllabus,
  subjects,
  lang,
}: MapExamSidebarInput): ExamSidebarServerDto {
  if (!exam || !subExam) {
    return {
      exam: null,
      subExam: null,
      syllabus: null,
      subjects: [],
      lang,
    };
  }

  return {
    exam: {
      ...mapBaseFields(exam),
      slug: exam.slug,
      name: resolveI18nField(exam.name, lang),
    },

    subExam: {
      ...mapBaseFields(subExam),
      slug: subExam.slug,
      name: resolveI18nField(subExam.name, lang),
    },

    syllabus: syllabus
      ? {
          ...mapBaseFields(syllabus),
          validFrom: syllabus.validFrom,
          validTo: syllabus.validTo ?? null,
          isActive: syllabus.isActive,
        }
      : null,

    subjects: subjects.map((subject) => ({
      ...mapBaseFields(subject),
      slug: subject.slug,
      name: resolveI18nField(subject.name, lang),
      order: subject.order, // ✅ from SubjectMap
      chapters: (subject.chapters || []).map((chapter: any) => ({
        slug: chapter.slug,
        name: resolveI18nField(chapter.name, lang),
        order: chapter.order, // ✅ from ChapterMap
      })),
    })),

    lang,
  };
}
