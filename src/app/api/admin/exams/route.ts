// src/app/api/admin/exams/route.ts
import { NextRequest, NextResponse } from "next/server";
import Exam from "@/models/mongoose/Exam.schema";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);
  const search = searchParams.get("search") || "";

  const query = search
    ? {
        deleted: { $ne: true },
        $or: [
          { "name.en": { $regex: search, $options: "i" } },
          { "shortName.en": { $regex: search, $options: "i" } },
          { slug: { $regex: search, $options: "i" } },
        ],
      }
    : { deleted: { $ne: true } };

  const [data, total] = await Promise.all([
    Exam.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean(),
    Exam.countDocuments(query),
  ]);

  return NextResponse.json({ data, total });
}
export async function POST(req: NextRequest) {
  const body = await req.json();

  const exam = await Exam.create({
    name: body.name,
    shortName: body.shortName,
    slug: body.slug,
    order: body.order,
    educationLevelId: body.educationLevelId,
    isActive: body.isActive ?? true,
    deleted: false,
  });

  return NextResponse.json(exam, { status: 201 });
}
