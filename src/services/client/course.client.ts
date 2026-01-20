// src/services/client/course.client.ts

import { ApiResponseUI } from "@/dto/apiResponse.ui.dto";
import { ExamCourseOverviewDTO } from "@/dto/examCourse.dto";

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