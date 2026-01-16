// src/models/dto/examCourse.mapper.ts

import { mapBaseFields } from "./base.mapper";
import { ExamCourseOverviewDTO } from "./examCourse.dto";

type Lang = "en" | "hi";

/**
 * Helper to resolve localized strings. 
 * Falls back to English if the requested language is missing.
 */
function resolveText(
  text: { en: string; hi?: string },
  lang: Lang
): string {
  return text[lang] ?? text.en;
}

/**
 * Maps raw database entities to ExamCourseOverviewDTO
 * Used for the /exams/[examSlug]/[courseSlug] page
 */
export function mapExamCourseOverviewDTO(
  exam: any,
  course: any,
  subjects: any[],
  lang: Lang
): ExamCourseOverviewDTO {
  return {
    exam: {
      ...mapBaseFields(exam),
      name: resolveText(exam.name, lang),
      slug: exam.slug,
    },
    course: {
      ...mapBaseFields(course),
      name: resolveText(course.name, lang),
      slug: course.slug,
    },
    subjects: subjects.map((s) => ({
      ...mapBaseFields(s),
      name: resolveText(s.name, lang),
      slug: s.slug,
    })),
  };
}