// src/app/api/course/toggle-active/route.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ok, fail } from "@/lib/response.util";
import { toggleCourseActive } from "@/services/server/course.server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await toggleCourseActive(body);
    return NextResponse.json(ok(data));
  } catch (error) {
    return NextResponse.json(fail(error));
  }
}
