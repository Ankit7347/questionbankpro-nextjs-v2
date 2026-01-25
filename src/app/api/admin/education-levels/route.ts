// src/app/api/admin/education-levels/route.ts

import { NextResponse } from "next/server";
import EducationLevel from "@/models/mongoose/EducationLevel.schema";

/**
 * GET → List education levels for dropdown
 */
export async function GET() {
  const data = await EducationLevel.find({
    isDeleted: { $ne: true },
    isActive: true,
  })
    .sort({ order: 1 })
    .lean();

  return NextResponse.json(data);
}
