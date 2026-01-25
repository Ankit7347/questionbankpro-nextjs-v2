// src/models/dto/courseAccess.api.dto.ts
/**
 * CourseAccessAPI
 * ----------------
 * Frontend mirror of dashboard course item.
 *
 * IMPORTANT:
 * - Matches API response shape
 * - DOES NOT import server DTOs
 * - Used only for typing API responses
 */
export interface CourseAccessAPI {
  id: string;
  name: string;
  slug: string;
  type: "FULL" | "CRASH" | "TEST_SERIES";

  price: {
    base: number;
    sale: number;
    final: number;
    currency: string;
    discountPercent?: number;
  };

  access: {
    isEnrolled: boolean;
    accessType?: "FREE" | "PAID";
    status?: "ACTIVE" | "EXPIRED" | "REVOKED";
    validTill?: string | null;
  };

  flags: {
    isFree: boolean;
  };

  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}
