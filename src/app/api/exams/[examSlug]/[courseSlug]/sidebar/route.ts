/**
 * src/app/api/exams/[examSlug]/[courseSlug]/sidebar/route.ts
 */

import { NextRequest } from "next/server";
import { ok, fail } from "@/lib/response.util";
import { getExamSidebarServer } from "@/services/server/examSidebar.server";

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{ examSlug: string; courseSlug: string }>;
  }
) {
  try {
    /**
     * Optional year (for multi-year syllabus support)
     * /api/exams/cbse-board/class-6/sidebar?year=2024
     */
    // ✅ MUST await params in your project
    const { examSlug, courseSlug } = await context.params;

    const yearParam = request.nextUrl.searchParams.get("year");
    const year = yearParam ? Number(yearParam) : undefined;

    const data = await getExamSidebarServer(examSlug, courseSlug, year);

    return Response.json(ok(data));
  } catch (error) {
    return Response.json(fail(error));
  }
}
