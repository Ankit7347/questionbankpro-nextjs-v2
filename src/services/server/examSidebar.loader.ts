/**
 * src/services/server/examSidebar.loader.ts
 *
 * Server-only loader for App Router layouts
 */

import { getExamSidebarServer } from "./examSidebar.server";

export async function loadExamSidebar(
  examSlug: string,
  courseSlug: string
) {
//   if (!examSlug || !courseSlug) {
//     throw new Error("Missing examSlug or courseSlug in layout params");
//   }

  return getExamSidebarServer(examSlug, courseSlug);
}
