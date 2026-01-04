import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { listExams } from "@/services/server/exam.server";

export async function GET() {
  try {
    await dbConnect();
    const exams = await listExams();

    return NextResponse.json(
      exams.map((e) => ({
        id: e.id,
        name: e.name,
        category: e.examType,
      }))
    );
  } catch {
    return NextResponse.json(
      { message: "Failed to load exams" },
      { status: 500 }
    );
  }
}
