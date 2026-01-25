// src/models/dto/courseAccess.mapper.ts

import { CourseAccessDTO } from "./courseAccess.dto";
import { mapBaseFields } from "./base.mapper";

type Lang = "en" | "hi";

function resolveText(
  text: { en: string; hi?: string },
  lang: Lang
): string {
  return text[lang] ?? text.en;
}
/**
 * Maps:
 * - Course mongoose doc
 * - UserCourseAccess mongoose doc (optional)
 * → CourseAccessDTO
 */
export function mapCourseAccessDTO(
  course: any,
  lang: Lang = "en",
  access?: any
): CourseAccessDTO {
  const isFree = course.salePrice === 0;

  return {
    ...mapBaseFields(course),

    id: course._id.toString(),

    name: resolveText(course.name, lang),
    slug: course.slug,
    type: course.type,

    price: {
      base: course.basePrice,
      sale: course.salePrice,
      final: course.salePrice,
      currency: course.currency ?? "INR",
      discountPercent: course.salePrice < course.basePrice ? Math.floor(((course.basePrice - course.salePrice) / course.basePrice) * 100) : 0
    },

    access: {
      isEnrolled: Boolean(access),
      accessType: access?.accessType,
      status: access?.status,
      validTill: access?.accessValidTill ?? null,
    },

    flags: {
      isFree,
    },
  };
}
