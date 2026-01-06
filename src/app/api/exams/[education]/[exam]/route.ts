// app/api/exams/[education]/[exam]/route.ts
import { NextResponse } from "next/server";
import { getExamLanding } from "@/services/server/examLanding.server";

interface RouteParams {
  education: string;
  exam: string;
}

export async function GET(
  req: Request,
  { params }: { params: Promise<RouteParams> }
) {
  const { education, exam } = await params; // ✅ REQUIRED

  const lang =
    req.headers.get("x-lang") === "hi" ? "hi" : "en";

  if (!education || !exam) {
    return NextResponse.json(
      { success: false, message: "Invalid route params" },
      { status: 400 }
    );
  }

  const data = await getExamLanding(exam, lang);

  if (!data) {
    return NextResponse.json(
      { success: false, message: "Exam not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data,
    statusCode: 200,
  });
}

