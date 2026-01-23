// src/app/api/course/route.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ok, fail } from "@/lib/response.util";
import {
  listCourses,
  createCourse,
} from "@/services/server/course.server";

export async function GET(req: NextRequest) {
  try {
    const data = await listCourses();
    return NextResponse.json(ok(data));
  } catch (error) {
    return NextResponse.json(fail(error));
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await createCourse(body);
    return NextResponse.json(ok(data, 201));
  } catch (error) {
    return NextResponse.json(fail(error));
  }
}
