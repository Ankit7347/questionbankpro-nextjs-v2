// src/models/dto/courseAccess.dto.ts

import { BaseDTO } from "./base.dto";

/**
 * CourseAccessDTO
 * -------------------------
 * Server-side projection of:
 * - Course (commercial)
 * - UserCourseAccess (enrollment)
 *
 * This is NOT a UI DTO.
 * UI will adapt this later if needed.
 */
export interface CourseAccessDTO extends BaseDTO {
  id: string;

  name: string;
  slug: string;
  type: "FULL" | "CRASH" | "TEST_SERIES";

  price: {
    base: number;
    sale: number;
    final: number;
    currency: string;
    discountPercent: number;
  };

  access: {
    isEnrolled: boolean;
    accessType?: "FREE" | "PAID";
    status?: "ACTIVE" | "EXPIRED" | "REVOKED";
    validTill?: Date | null;
  };

  flags: {
    isFree: boolean;
  };
}
