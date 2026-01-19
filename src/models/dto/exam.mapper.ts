// src/models/dto/exam.mapper.ts

import { mapBaseFields } from "./base.mapper";

type Lang = "en" | "hi";

function resolveText(
  text: { en: string; hi?: string },
  lang: Lang
): string {
  return text[lang] ?? text.en;
}

function buildExamDTO(
  exam: any,
  subExams: any[],
  lang: Lang
) {
  return {
    ...mapBaseFields(exam),
    examName: resolveText(exam.name, lang),
    examSlug: exam.slug,
    subExams: subExams.map((se) => ({
      ...mapBaseFields(se),
      name: resolveText(se.name, lang),
      slug: se.slug,
    })),
  };
}

export const mapExamDTO = buildExamDTO;