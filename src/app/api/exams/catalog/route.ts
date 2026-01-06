// app/api/exams/catalog/route.ts
import { NextResponse } from "next/server";
import { getExamCatalog } from "@/services/server/exam.server";

export async function GET(req: Request) {
  const lang =
    req.headers.get("x-lang") === "hi" ? "hi" : "en";

  const data = await getExamCatalog(lang);

  return NextResponse.json({
    success: true,
    data,
    statusCode: 200,
  });
}

