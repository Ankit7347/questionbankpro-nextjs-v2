// src/models/dto/course.mapper.ts

import { mapBaseFields } from "./base.mapper";
import { CourseDTO } from "./course.dto";

type Lang = "en" | "hi";

function resolveText(
  text: { en: string; hi?: string },
  lang: Lang
): string {
  return text[lang] ?? text.en;
}

function buildCourseDTO(
  course: any,
  lang: Lang
): CourseDTO {
  return {
    ...mapBaseFields(course),

    id: course._id.toString(),
    subExamId: course.subExamId.toString(),

    type: course.type,

    name: resolveText(course.name, lang),
    slug: course.slug,

    basePrice: course.basePrice,
    salePrice: course.salePrice,
    currency: course.currency ?? "INR",

    validFrom: course.validFrom ?? null,
    validTo: course.validTo ?? null,

    isActive: course.isActive,
    visibility: course.visibility,
  };
}

export const mapCourseDTO = buildCourseDTO;
