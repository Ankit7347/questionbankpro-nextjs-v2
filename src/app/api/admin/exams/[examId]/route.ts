// src/app/api/admin/exams/[examId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import Exam from "@/models/mongoose/Exam.schema";
import dbConnect from "@/lib/mongodb";

/**
 * NOTE (Next.js 15):
 * - params is ASYNC
 * - must be awaited before use
 */

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ examId: string }> }
) {
  // ✅ unwrap params (IMPORTANT)
  const { examId } = await ctx.params;
  await dbConnect();
  const exam = await Exam.findOne({
    _id: examId,
    deleted: { $ne: true },
  }).lean();

  if (!exam) {
    return NextResponse.json(
      { message: "Exam not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(exam);
}

/**
 * PATCH → Edit Exam
 */
export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ examId: string }> }
) {
  // ✅ unwrap params (IMPORTANT)
  const { examId } = await ctx.params;

  const body = await req.json();
  await dbConnect();
  const updated = await Exam.findByIdAndUpdate(
    examId,
    { $set: body },
    { new: true }
  ).lean();

  return NextResponse.json(updated);
}
