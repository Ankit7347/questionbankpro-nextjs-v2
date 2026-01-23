// src/dto/course.ui.dto.ts

/**
 * Course UI DTO
 * -------------------------
 * Used ONLY by UI components (Dashboard / Courses page)
 * Represents a merged projection of:
 * - Course (commercial)
 * - Pricing (resolved)
 * - UserCourseAccess (enrollment)
 *
 * UI must NOT derive business logic from this.
 */

export interface CourseUI {
  id: string;

  name: string;
  slug: string;

  type: "FULL" | "CRASH" | "TEST_SERIES";

  /* --------------------------------
     Pricing (already resolved)
  --------------------------------- */
  price: {
    base: number;
    sale: number;
    final: number;
    discountPercent?: number; // e.g. 25 for 25% OFF
    currency: string; // INR
  };

  /* --------------------------------
     User Access State
  --------------------------------- */
  access: {
    isEnrolled: boolean;
    accessType?: "FREE" | "PAID";
    status?: "ACTIVE" | "EXPIRED" | "REVOKED";
    validTill?: string | null; // ISO string for UI
  };

  /* --------------------------------
     UI Flags (rendering hints only)
  --------------------------------- */
  flags: {
    isFree: boolean;
    isNew?: boolean;
    isPopular?: boolean;
  };
}
