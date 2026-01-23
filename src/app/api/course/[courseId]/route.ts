// src/app/api/course/[courseId]/route.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ok, fail } from "@/lib/response.util";
import {
  getCourseById,
  updateCourseById,
  deleteCourseById,
} from "@/services/server/course.server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await context.params;
    const data = await getCourseById(courseId);
    return NextResponse.json(ok(data));
  } catch (error) {
    return NextResponse.json(fail(error));
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await context.params;
    const body = await req.json();
    const data = await updateCourseById(courseId, body);
    return NextResponse.json(ok(data));
  } catch (error) {
    return NextResponse.json(fail(error));
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await context.params;
    const data = await deleteCourseById(courseId);
    return NextResponse.json(ok(data));
  } catch (error) {
    return NextResponse.json(fail(error));
  }
}
