// src/models/dto/examCourse.mapper.ts

import { mapBaseFields } from "./base.mapper";

type Lang = "en" | "hi";

function resolveText(
  text: { en: string; hi?: string },
  lang: Lang
): string {
  return text[lang] ?? text.en;
}

export function mapExamCourseOverviewDTO(
  exam: any,
  course: any,
  subjects: any[],
  lang: Lang
) {
  return {
    exam: {
      name: resolveText(exam.name, lang),
      slug: exam.slug,
    },
    course: {
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
