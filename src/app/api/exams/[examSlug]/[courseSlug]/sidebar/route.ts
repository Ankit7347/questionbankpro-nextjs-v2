/**
 * src/app/api/exams/[examSlug]/[courseSlug]/sidebar/route.ts
 */

import { NextRequest } from "next/server";
import { ok, fail } from "@/lib/response.util";
import { getExamSidebarServer } from "@/services/server/examSidebar.server";

export async function GET(
  _request: NextRequest,
  context: {
    params: Promise<{ examSlug: string; courseSlug: string }>;
  }
) {
  try {
    const { examSlug, courseSlug } = await context.params;

    const data = await getExamSidebarServer(examSlug, courseSlug);

    return Response.json(ok(data));
  } catch (error) {
    return Response.json(fail(error));
  }
}
