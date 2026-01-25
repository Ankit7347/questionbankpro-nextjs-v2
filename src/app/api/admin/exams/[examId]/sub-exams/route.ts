// src/app/api/admin/exams/[examId]/sub-exams/route.ts

import { NextRequest, NextResponse } from "next/server";
import SubExam from "@/models/mongoose/SubExam.schema";

/**
 * GET → List SubExams under Exam
 */
export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ examId: string }> }
) {
  const { examId } = await ctx.params;

  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);
  const search = searchParams.get("search") || "";

  const query: any = {
    examId,
    isDeleted: { $ne: true },
  };

  if (search) {
    query.$or = [
      { "name.en": { $regex: search, $options: "i" } },
      { "name.hi": { $regex: search, $options: "i" } },
      { stream: { $regex: search, $options: "i" } },
    ];
  }

  const [data, total] = await Promise.all([
    SubExam.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ year: -1, order: 1 })
      .lean(),
    SubExam.countDocuments(query),
  ]);

  return NextResponse.json({ data, total });
}

/**
 * POST → Create SubExam
 */
export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ examId: string }> }
) {
  const { examId } = await ctx.params;
  const body = await req.json();

  const subExam = await SubExam.create({
    ...body,
    examId,
    isDeleted: false,
  });

  return NextResponse.json(subExam, { status: 201 });
}
