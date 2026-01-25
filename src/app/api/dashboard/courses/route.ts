// src/app/api/dashboard/courses/route.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ok, fail } from "@/lib/response.util";
import { getDashboardCourses } from "@/services/server/course.server";

export async function GET(req: NextRequest) {
  try {
    const data = await getDashboardCourses();
    return NextResponse.json(ok(data));
  } catch (err) {
    return NextResponse.json(fail(err));
  }
}
