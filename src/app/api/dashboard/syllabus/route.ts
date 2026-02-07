// src/app/api/dashboard/syllabus/route.ts
/**
 * Dashboard → Syllabus API Route
 * ==============================
 *
 * Responsibility:
 * - Expose academic syllabus structure for logged-in user
 *
 * Resolution:
 * - session.user.subExamId (handled in service)
 *
 * Rules:
 * - NO query params
 * - NO catalog behavior
 * - Dashboard-only
 */

import { NextResponse } from "next/server"
import { getDashboardSyllabus } from "@/services/server/syllabus.server"
import { ok, fail } from "@/lib/response.util"

export async function GET() {
  try {
    const syllabus = await getDashboardSyllabus()
    return NextResponse.json(ok(syllabus))
  } catch (err) {
    console.error("Error fetching dashboard syllabus:", err)

    // 🔒 Do not leak internal error details
    return NextResponse.json(
      fail("Failed to fetch dashboard syllabus"),
      { status: 500 }
    )
  }
}
