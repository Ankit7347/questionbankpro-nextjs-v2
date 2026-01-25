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
 *
 * IMPORTANT DOMAIN RULES:
 * - FREE / PAID comes from access.accessType
 * - Time-bound vs lifetime comes from access.accessValidTill
 * - Price does NOT decide entitlement
 */
export function mapCourseAccessDTO(
  course: any,
  lang: Lang = "en",
  access?: any
): CourseAccessDTO {
  const isFreeAccess = access?.accessType === "FREE";

  const discountPercent =
    !isFreeAccess && course.salePrice < course.basePrice
      ? Math.floor(
          ((course.basePrice - course.salePrice) / course.basePrice) * 100
        )
      : undefined;

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
      discountPercent,
    },

    access: {
      isEnrolled: Boolean(access),
      accessType: access?.accessType, // FREE or PAID
      status: access?.status,
      validTill: access?.accessValidTill ?? null, // allows time-bound FREE
    },

    flags: {
      isFree: isFreeAccess,
    },
  };
}
