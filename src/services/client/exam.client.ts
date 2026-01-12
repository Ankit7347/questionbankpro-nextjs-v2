// src/services/client/exam.client.ts

import { ApiResponseUI } from "@/dto/apiResponse.ui.dto";
import { ExamLandingUI } from "@/dto/examLanding.ui.dto";
import { ExamCatalogUI } from "@/dto/examCatalog.ui.dto";
export async function fetchExamCatalog(
  lang: "en" | "hi"
): Promise<{ success: true; data: ExamCatalogUI[] }> {
  const res = await fetch("/api/exams/catalog", {
    headers: { "x-lang": lang },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch exam catalog");
  }

  return res.json();
}
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
