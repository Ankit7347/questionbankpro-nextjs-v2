/**
 * src/services/client/examSidebar.client.ts
 */

import { ExamSidebarDto } from "@/dto/examSidebar.ui.dto";
import { ApiResponseUI } from "@/dto/apiResponse.ui.dto";

export async function fetchExamSidebar(
  examSlug: string,
  courseSlug: string
): Promise<ExamSidebarDto> {
  const res = await fetch(
    `/api/exams/${examSlug}/${courseSlug}/sidebar`,
    { cache: "no-store" }
  );

  const json: ApiResponseUI<ExamSidebarDto> = await res.json();

  if (!json.success || !json.data) {
    throw new Error(json.error || "Failed to load exam sidebar");
  }

  return json.data;
}
