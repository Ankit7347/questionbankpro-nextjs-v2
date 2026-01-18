/**
 * src/services/server/examSidebar.loader.ts
 *
 * Server-only loader for App Router layouts
 */

import { getExamSidebarServer } from "./examSidebar.server";
import { ApiError } from "@/lib/apiError";

export async function loadExamSidebar(examSlug: string,courseSlug: string) {
  if (!examSlug) {
    throw new Error("Missing examSlug in layout params");
  }

  try {
    return await getExamSidebarServer(examSlug,courseSlug);
  } catch (error) {
    // ⛔ NEVER crash a layout
    if (error instanceof ApiError) {
      return {
        exam: null,
        course: null,
        syllabus: null,
        subjects: [],
        lang: "en",
      };
    }
    console.log(error);
    throw error;
  }
}
