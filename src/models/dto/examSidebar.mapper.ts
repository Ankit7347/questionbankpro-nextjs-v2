/**
 * src/models/dto/examSidebar.mapper.ts
 */

import { ExamSidebarServerDto } from "./examSidebar.dto";
import { mapBaseFields } from "./base.mapper";
import { Lang, resolveI18nField } from "@/lib/i18n";

interface MapExamSidebarInput {
  exam: any;
  course: any;
  syllabus?: any | null;
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
      ...mapBaseFields(exam),
      slug: exam.slug,
      name: resolveI18nField(exam.name, lang),
    },

    course: {
      ...mapBaseFields(course),
      slug: course.slug,
      name: resolveI18nField(course.name, lang),
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
      chapters: (subject.chapters || []).map((chapter: any) => ({
        slug: chapter.slug,
        name: resolveI18nField(chapter.name, lang),
      })),
    })),

    lang,
  };
}
