// src/app/api/course/by-subexam/route.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ok, fail } from "@/lib/response.util";
import { listCoursesBySubExam } from "@/services/server/course.server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const subExamSlug = searchParams.get("subExamSlug");

    const data = await listCoursesBySubExam(subExamSlug);
    return NextResponse.json(ok(data));
  } catch (error) {
    return NextResponse.json(fail(error));
  }
}
