// src/models/dto/course.ui.mapper.ts
import { CourseAccessAPI } from "@/dto/courseAccess.api.dto";
import { CourseUI } from "@/dto/course.ui.dto";

/**
 * mapCourseAccessAPIToUI
 * ---------------------
 * Converts API data → UI data
 */
export function mapCourseAccessAPIToUI(
  api: CourseAccessAPI,
  ctx: {
    examSlug: string;
    subExamSlug: string;
  }
): CourseUI {
  const now = new Date();
  let status: CourseUI["access"]["status"] = "NONE";

  if (!api.access?.isEnrolled) {
    status = "NONE";
  } else if (!api.access.validTill) {
    status = "LIFETIME";
  } else {
    const diffDays =
      (new Date(api.access.validTill).getTime() - now.getTime()) /
      (1000 * 60 * 60 * 24);

    if (diffDays <= 0) status = "EXPIRED";
    else if (diffDays <= 7) status = "EXPIRING";
    else status = "ACTIVE";
  }

  return {
    id: api.id,
    name: api.name,
    slug: api.slug,
    type: api.type,

    examSlug: ctx.examSlug,
    subExamSlug: ctx.subExamSlug,

    price: api.price
      ? {
          base: api.price.base,
          final: api.price.final,
          discountPercent: api.price.discountPercent,
          currency: api.price.currency,
        }
      : undefined,

    access: {
      status,
      expiresAt: api.access?.validTill ?? null,
    },

    flags: {
      isFree: api.flags.isFree,
    },
  };
}
