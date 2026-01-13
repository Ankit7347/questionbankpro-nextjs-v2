/**
 * src/models/dto/examSidebar.mapper.ts
 */

import { ExamSidebarServerDto } from "./examSidebar.dto";
import { Lang, resolveI18nField } from "@/lib/i18n";

export function mapExamSidebar(
  exam: any,
  course: any,
  subjects: any[],
  lang: Lang
): ExamSidebarServerDto {
  return {
    exam: {
      slug: exam.slug,
      name: resolveI18nField(exam.name, lang),
    },
    course: {
      slug: course.slug,
      name: resolveI18nField(course.name, lang),
    },
    subjects: subjects.map((subject) => ({
      slug: subject.slug,
      name: resolveI18nField(subject.name, lang),
      chapters: subject.chapters.map((chapter: any) => ({
        slug: chapter.slug,
        name: resolveI18nField(chapter.name, lang),
      })),
    })),
  };
}
