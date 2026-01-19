// src/app/api/exams/[examSlug]/[courseSlug]/route.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getExamSubExamOverview } from "@/services/server/examCourse.server";

export async function GET(
  req: NextRequest,
  context: {
    params: Promise<{
      examSlug: string;
      courseSlug: string;
    }>;
  }
) {
  // ✅ IMPORTANT: params is a Promise in Next.js 14/15
  const { examSlug, courseSlug } = await context.params;


  const data = await getExamSubExamOverview(
    examSlug,
    courseSlug
  );
  
  if (!data) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: "Course not found",
        statusCode: 404,
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data,
    error: null,
    statusCode: 200,
  });
}
