/**
 * src/models/dto/examSidebar.mapper.ts
 */

import { ExamSidebarServerDto } from "./examSidebar.dto";
import { Lang, resolveI18nField } from "@/lib/i18n";

interface MapExamSidebarInput {
  exam: any;
  course: any;
  syllabus?: any;
  subjects: any[];
  lang: Lang;
}

export function mapExamSidebar({
  exam,
  course,
  syllabus,
  subjects,
  lang,
}: MapExamSidebarInput): ExamSidebarServerDto {
  return {
    exam: {
      slug: exam.slug,
      name: resolveI18nField(exam.name, lang),
    },

    course: {
      slug: course.slug,
      name: resolveI18nField(course.name, lang),
    },
    syllabus: {
      year: syllabus.year,
    },
    subjects: subjects.map((subject) => ({
      slug: subject.slug,
      name: resolveI18nField(subject.name, lang),
      chapters: (subject.chapters || []).map((chapter: any) => ({
        slug: chapter.slug,
        name: resolveI18nField(chapter.name, lang),
      })),
    })),

    lang,
  };
}
