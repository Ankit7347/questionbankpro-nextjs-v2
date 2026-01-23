// src/app/api/coupon/toggle-active/route.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ok, fail } from "@/lib/response.util";
import { toggleCouponActive } from "@/services/server/coupon.server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await toggleCouponActive(body);
    return NextResponse.json(ok(data));
  } catch (error) {
    return NextResponse.json(fail(error));
  }
}
