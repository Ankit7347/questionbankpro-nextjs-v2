// src/models/dto/exam.mapper.ts
import { mapBaseFields } from "./base.mapper";

type Lang = "en" | "hi";

function resolveText(
  text: { en: string; hi?: string },
  lang: Lang
): string {
  return text[lang] ?? text.en;
}

export function mapExamCardDTO(
  exam: any,
  courses: any[],
  lang: Lang
) {
  return {
    ...mapBaseFields(exam),
    examName: resolveText(exam.name, lang),
    examSlug: exam.slug,
    courses: courses.map((c) => ({
      ...mapBaseFields(c),
      name: resolveText(c.name, lang),
      slug: c.slug,
    })),
  };
}

export function mapExamLandingDTO(
  exam: any,
  courses: any[],
  lang: Lang
) {
  return {
    ...mapBaseFields(exam),
    examName: resolveText(exam.name, lang),
    courses: courses.map((c) => ({
      ...mapBaseFields(c),
      name: resolveText(c.name, lang),
      slug: c.slug,
    })),
  };
}
