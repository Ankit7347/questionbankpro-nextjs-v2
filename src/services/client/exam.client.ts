// src/services/client/exam.client.ts

import { ApiResponseUI } from "@/dto/apiResponse.ui.dto";
import { ExamLandingUI } from "@/dto/examLanding.ui.dto";
import { EducationLevelGroup } from "@/dto/examCatalog.ui.dto";

/**
 * /exams page
 * ONE API call
 * Grouped by education level
 */
export async function fetchExamCatalog(
  lang: "en" | "hi"
): Promise<ApiResponseUI<EducationLevelGroup[]>> {
  const res = await fetch("/api/exams/catalog", {
    headers: { "x-lang": lang },
  });

  if (!res.ok) {
    return {
      success: false,
      data: null,
      error: "Failed to fetch exam catalog",
      statusCode: res.status,
    };
  }

  return res.json();
}

/**
 * Home page
 * ONE API call
 * Flat list
 */
export async function fetchExamLanding(): Promise<ApiResponseUI<ExamLandingUI[]>> {
  // 1. Get the base URL (Use environment variable for production)
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const revalidateTime = Number(process.env.NEXT_PUBLIC_API_REVALIDATE) || 3600;
  try {
    const res = await fetch(`${baseUrl}/exams/landing`, {
      // 2. Add caching config here
      next: { 
        revalidate:revalidateTime , // Re-fetch data at most every hour
        tags: ["exams-landing"] // Tag for manual cache clearing
      }
    });

    if (!res.ok) {
      return {
        success: false,
        data: null,
        error: "Failed to fetch exam landing",
        statusCode: res.status,
      };
    }

    return res.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      error: "Network error occurred",
      statusCode: 500,
    };
  }
}