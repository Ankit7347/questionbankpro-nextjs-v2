// src/models/dto/course.dto.ts

import { BaseDTO } from "./base.dto";

/**
 * Course DTO (Commercial Layer)
 * Used by API responses
 */
export interface CourseDTO extends BaseDTO {
  id: string;

  subExamId: string;

  type: "FULL" | "CRASH" | "TEST_SERIES";

  name: string;
  slug: string;

  basePrice: number;
  salePrice: number;
  currency: string;

  validFrom: Date | null;
  validTo: Date | null;

  isActive: boolean;
  visibility: "PUBLIC" | "PRIVATE";
}
import { CourseAccessDTO } from "./courseAccess.dto";

/**
 * DashboardCoursesDTO
 * -------------------
 * Course-domain aggregate DTO
 * Used ONLY for dashboard APIs
 */
export interface DashboardCoursesDTO {
    context: {
        examSlug: string;
        subExamSlug: string;
    };
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
