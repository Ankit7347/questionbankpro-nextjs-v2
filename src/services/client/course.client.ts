// src/services/client/course.client.ts

import { ApiResponseUI } from "@/dto/apiResponse.ui.dto";
import { ExamCourseOverviewDTO } from "@/dto/examCourse.dto";
import { CourseUI } from "@/dto/course.ui.dto";

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


/**
 * Dashboard → Courses page
 * Fetches:
 * 1. User enrolled courses
 * 2. Available courses for exploration
 */
export async function fetchDashboardCourses(
  subExamSlug: string
): Promise<
  ApiResponseUI<{
    enrolled: CourseUI[];
    explore: CourseUI[];
  }>
> {
  try {
    const userId = '69738bce5ccf5655b013cfba';

    if (!userId) {
      return {
        success: false,
        data: null,
        error: "User not authenticated",
        statusCode: 401,
      };
    }

    // 1. Fetch enrolled courses
    const enrolledRes = await fetch("/api/user/courses", {
      headers: { "x-user-id": userId },
    });

    if (!enrolledRes.ok) {
      return {
        success: false,
        data: null,
        error: "Failed to fetch enrolled courses",
        statusCode: enrolledRes.status,
      };
    }

    const enrolledJson = await enrolledRes.json();
    const enrolled: CourseUI[] = enrolledJson.data ?? [];

    // 2. Fetch explore courses
    const exploreRes = await fetch(
      `/api/course/by-subexam?subExamSlug=${subExamSlug}`,
      { headers: { "x-user-id": userId } }
    );

    if (!exploreRes.ok) {
      return {
        success: false,
        data: null,
        error: "Failed to fetch available courses",
        statusCode: exploreRes.status,
      };
    }

    const exploreJson = await exploreRes.json();
    const explore: CourseUI[] = exploreJson.data ?? [];

    // =====================================
    // FIX: Remove duplicates from explore
    // =====================================
    const enrolledIds = new Set(enrolled.map((c) => c.id));
    const filteredExplore = explore.filter(
      (c) => !enrolledIds.has(c.id)
    );

    // FINAL return
    return {
      success: true,
      data: {
        enrolled,
        explore: filteredExplore,
      },
      error: null,
      statusCode: 200,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Network error occurred",
      statusCode: 500,
    };
  }
}

