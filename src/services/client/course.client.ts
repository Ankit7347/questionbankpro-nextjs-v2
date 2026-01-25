// src/services/client/course.client.ts

/**
 * Course Client Service
 * =====================
 *
 * Pattern reference:
 * - src/services/client/exam.client.ts
 *
 * Responsibility:
 * - Client-side gateway for course APIs
 * - Fetches dashboard courses
 * - Returns ApiResponseUI<DashboardCoursesUI>
 *
 * Rules:
 * - NO business logic
 * - NO inline DTO definitions
 * - DTOs come ONLY from src/dto
 */

import { ApiResponseUI } from "@/dto/apiResponse.ui.dto";
import { DashboardCoursesUI } from "@/dto/course.ui.dto";
import { ExamCourseOverviewDTO } from "@/dto/examCourse.dto";

/**
 * Dashboard → Courses
 * ONE API call
 */
export async function fetchDashboardCourses(): Promise<ApiResponseUI<DashboardCoursesUI>> {
  try {
    const res = await fetch('/api/dashboard/courses');

    if (!res.ok) {
      return {
        success: false,
        data: null,
        error: "Failed to fetch dashboard courses",
        statusCode: res.status,
      };
    }

    return res.json();
  } catch {
    return {
      success: false,
      data: null,
      error: "Network error occurred",
      statusCode: 500,
    };
  }
}



/**
 * /exams/[examSlug]/[subExamSlug] page
 * Fetches the specific course details including subjects
 */
export async function fetchCourseOverview(
  examSlug: string,
  subExamSlug: string,
  lang: "en" | "hi" = "en"
): Promise<ApiResponseUI<ExamCourseOverviewDTO>> {
  try {
    const res = await fetch(`/api/exams/${examSlug}/${subExamSlug}`, {
      headers: { "x-lang": lang },
    });

    if (!res.ok) {
      return {
        success: false,
        data: null,
        error: `Failed to fetch course: ${subExamSlug}`,
        statusCode: res.status,
      };
    }

    return await res.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "An unknown error occurred",
      statusCode: 500,
    };
  }
}