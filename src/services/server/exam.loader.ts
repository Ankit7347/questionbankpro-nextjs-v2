/**
 * src/services/server/exam.loader.ts
 */
import { getExamBySlug } from "./exam.server";
import { ApiError } from "@/lib/apiError";

export async function verifyExamExists(examSlug: string): Promise<boolean> {
  if (!examSlug) return false;

  try {
    const response = await getExamBySlug(examSlug);
    
    // Check the standardized ApiResponse structure
    return response.success;
  } catch (error) {
    console.error("Loader Error:", error);
    // Standard catch logic to prevent layout crashing
    if (error instanceof ApiError) {
      return false;
    }
    return false;
  }
}