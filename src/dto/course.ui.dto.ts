// src/models/dto/course.dto.ts
/**
 * CourseUI
 * --------
 * UI-facing course model.
 * Derived from CourseAccessAPI.
 */
export interface CourseUI {
  id: string;
  name: string;
  slug: string;
  type: "FULL" | "CRASH" | "TEST_SERIES";

  examSlug: string;
  subExamSlug: string;

  price?: {
    base: number;
    final: number;
    discountPercent?: number;
    currency: string;
  };

  access: {
    status: "LIFETIME" | "ACTIVE" | "EXPIRING" | "EXPIRED" | "NONE";
    expiresAt?: string | null;
  };

  flags: {
    isFree: boolean;
  };
}



/**
 * DashboardCoursesUI
 * -----------------
 * Course-domain DTO for dashboard page
 * Returned by /api/dashboard/courses
 */
export interface DashboardCoursesUI {
  context: {
    examSlug: string;
    subExamSlug: string;
  };
  myCourses: {
    active: CourseUI[];
    expiring: CourseUI[];
    expired: CourseUI[];
  };
  explore: {
    free: CourseUI[];
    paid: CourseUI[];
  };
}

/**
 * Checkout Page
 */
export interface CourseCheckoutData {
  id: string;
  name: string;
  slug: string;
  price: number;
  isFree: boolean;
}