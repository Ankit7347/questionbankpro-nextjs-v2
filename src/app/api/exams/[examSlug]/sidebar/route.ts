/**
 * src/app/api/exams/[examSlug]/sidebar/route.ts
 */

import { NextRequest } from "next/server";
import { ok, fail } from "@/lib/response.util";
import { getExamSidebarServer } from "@/services/server/examSidebar.server";

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{ examSlug: string }>;
  }
) {
  try {
    // MUST await params in App Router
    const { examSlug } = await context.params;

    const data = await getExamSidebarServer(examSlug);

    const response = ok(data);

    return Response.json(response, {
      status: response.statusCode,
    });
  } catch (error) {
    const response = fail(error);

    return Response.json(response, {
      status: response.statusCode,
    });
  }
}
