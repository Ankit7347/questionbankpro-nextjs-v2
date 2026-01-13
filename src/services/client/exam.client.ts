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
export async function fetchExamLanding(): Promise<
  ApiResponseUI<ExamLandingUI[]>
> {
  const res = await fetch("/api/exams/landing");

  if (!res.ok) {
    return {
      success: false,
      data: null,
      error: "Failed to fetch exam landing",
      statusCode: res.status,
    };
  }

  return res.json();
}
