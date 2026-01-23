// src/app/api/user/courses/route.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ok, fail } from "@/lib/response.util";
import { getUserCourses } from "@/services/server/userCourse.server";

/**
 * Dashboard → My Courses
 */
export async function GET(req: NextRequest) {
  try {
    // TEMP auth (replace later)
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "Unauthorized",
          statusCode: 401,
        },
        { status: 401 }
      );
    }

    const data = await getUserCourses(userId);
    return NextResponse.json(ok(data));
  } catch (error) {
    return NextResponse.json(fail(error));
  }
}
