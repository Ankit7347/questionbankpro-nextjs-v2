// src/models/dto/course.mapper.ts

import { mapBaseFields } from "./base.mapper";
import { CourseCheckoutData, CourseDTO } from "./course.dto";

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
import { CourseAccessDTO } from "./courseAccess.dto";

/**
 * DashboardCoursesDTO
 * -------------------
 * Course-domain DTO for dashboard response
 * Contains ONLY other DTOs
 */
export interface DashboardCoursesDTO {
  myCourses: {
    active: CourseAccessDTO[];
    expiring: CourseAccessDTO[];
    expired: CourseAccessDTO[];
  };
  explore: {
    free: CourseAccessDTO[];
    paid: CourseAccessDTO[];
  };
}

export function mapCourseCheckoutDTO(
  course: any,
  lang: Lang
): CourseCheckoutData {
  // 1. Get the values from DB (defaulting to 0 if totally missing)
  const base = course.basePrice || 0;
  const sale = course.salePrice;

  /** * Logic: 
   * If sale is null, undefined, or 0, use base price.
   * Otherwise, use sale price.
   */
  const finalPrice = (sale && sale > 0) ? sale : base;

  return {
    id: course._id.toString(),
    name: resolveText(course.name, lang),
    slug: course.slug,
    
    // Final price used for checkout
    price: finalPrice, 
    
    // It's only free if the final calculated price is 0
    isFree: finalPrice === 0,
  };
}
