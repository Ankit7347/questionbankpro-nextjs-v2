// src/services/client/exam.client.ts
import { EducationLevelGroup } from "@/types/exam";
import { ExamLandingDTO } from "@/models/dto/exam.dto";

export async function fetchExamCatalog(
  lang: "en" | "hi"
): Promise<{ success: true; data: EducationLevelGroup[] }> {
  const res = await fetch("/api/exams/catalog", {
    headers: { "x-lang": lang },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch exam catalog");
  }

  return res.json();
}

export async function fetchExamLanding(): Promise<{
  success: true;
  data: ExamLandingDTO[];
}> {
  const res = await fetch("/api/exams/landing");

  if (!res.ok) {
    throw new Error("Failed to fetch exam landing");
  }

  return res.json();
}

export async function fetchExamLandingBySlug(
  educationSlug: string,
  examSlug: string,
  lang: "en" | "hi" = "en"
) {
  if (!educationSlug || !examSlug) {
    throw new Error("educationSlug or examSlug missing");
  }

  const res = await fetch(
    `/api/exams/${educationSlug}/${examSlug}`,
    {
      headers: { "x-lang": lang },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch exam landing");
  }

  return res.json();
}
