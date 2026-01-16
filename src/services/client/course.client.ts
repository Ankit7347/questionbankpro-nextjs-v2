// src/services/client/course.client.ts

import { ApiResponseUI } from "@/dto/apiResponse.ui.dto";
import { ExamCourseOverviewDTO } from "@/dto/examCourse.dto";

/**
 * /exams/[examSlug]/[courseSlug] page
 * Fetches the specific course details including subjects
 */
export async function fetchCourseOverview(
  examSlug: string,
  courseSlug: string,
  lang: "en" | "hi" = "en"
): Promise<ApiResponseUI<ExamCourseOverviewDTO>> {
  try {
    const res = await fetch(`/api/exams/${examSlug}/${courseSlug}`, {
      headers: { "x-lang": lang },
    });

    if (!res.ok) {
      return {
        success: false,
        data: null,
        error: `Failed to fetch course: ${courseSlug}`,
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