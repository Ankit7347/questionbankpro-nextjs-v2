// src/app/api/course/pricing/route.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ok, fail } from "@/lib/response.util";
import { resolveCoursePricing } from "@/services/server/coursePricing.server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await resolveCoursePricing(body);
    return NextResponse.json(ok(data));
  } catch (error) {
    return NextResponse.json(fail(error));
  }
}
