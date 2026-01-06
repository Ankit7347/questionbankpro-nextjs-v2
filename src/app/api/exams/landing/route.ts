// src/app/api/exam/landing/route.ts

import { NextResponse } from "next/server";
import { getExamLandingList } from "@/services/server/examLanding.server";

export async function GET() {
  const data = await getExamLandingList();

  return NextResponse.json({
    success: true,
    data,
    statusCode: 200,
  });
}
