// src/app/api/exam/landing/route.ts

import { NextResponse } from "next/server";
import { getExamLandingList } from "@/services/server/examLanding.server";

export async function GET(req: Request) {
  const lang =  req.headers.get("x-lang") === "hi" ? "hi" : "en";

  const data = await getExamLandingList(lang);

  return NextResponse.json({
    success: true,
    data,
    statusCode: 200,
  });
}
