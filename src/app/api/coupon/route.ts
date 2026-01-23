// src/app/api/coupon/route.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ok, fail } from "@/lib/response.util";
import {
  listCoupons,
  createCoupon,
} from "@/services/server/coupon.server";

export async function GET() {
  try {
    const data = await listCoupons();
    return NextResponse.json(ok(data));
  } catch (error) {
    return NextResponse.json(fail(error));
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await createCoupon(body);
    return NextResponse.json(ok(data, 201));
  } catch (error) {
    return NextResponse.json(fail(error));
  }
}
