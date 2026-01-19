// app/api/exams/catalog/route.ts
import { NextResponse } from "next/server";
import { getExamCatalog } from "@/services/server/exam.server";

export async function GET(req: Request) {
  
  const data = await getExamCatalog();

  return NextResponse.json({
    success: true,
    data,
    statusCode: 200,
  });
}

