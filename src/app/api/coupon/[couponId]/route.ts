// src/app/api/coupon/[couponId]/route.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ok, fail } from "@/lib/response.util";
import {
  getCouponById,
  updateCouponById,
  deleteCouponById,
} from "@/services/server/coupon.server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ couponId: string }> }
) {
  try {
    const { couponId } = await context.params;
    const data = await getCouponById(couponId);
    return NextResponse.json(ok(data));
  } catch (error) {
    return NextResponse.json(fail(error));
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ couponId: string }> }
) {
  try {
    const { couponId } = await context.params;
    const body = await req.json();
    const data = await updateCouponById(couponId, body);
    return NextResponse.json(ok(data));
  } catch (error) {
    return NextResponse.json(fail(error));
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ couponId: string }> }
) {
  try {
    const { couponId } = await context.params;
    const data = await deleteCouponById(couponId);
    return NextResponse.json(ok(data));
  } catch (error) {
    return NextResponse.json(fail(error));
  }
}
