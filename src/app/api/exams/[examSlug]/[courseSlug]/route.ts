// src/app/api/exams/[examSlug]/[courseSlug]/route.ts

import { NextResponse } from "next/server";
import { getExamCourseOverview } from "@/services/server/examCourse.server";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: { examSlug: string; courseSlug: string };
  }
) {
  const lang =
    req.headers.get("x-lang") === "hi" ? "hi" : "en";

  const { examSlug, courseSlug } = params;

  const data = await getExamCourseOverview(
    examSlug,
    courseSlug,
    lang
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
