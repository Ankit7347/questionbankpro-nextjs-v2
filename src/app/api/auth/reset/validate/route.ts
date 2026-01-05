// src/app/api/auth/reset/validate/route.ts

import { NextResponse } from "next/server";
import { validateResetToken } from "@/services/server/auth.server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const email = searchParams.get("email")?.trim();
  const otp = searchParams.get("otp")?.trim();

  if (!email || !otp) {
    return NextResponse.json({ valid: false });
  }

  const valid = await validateResetToken(email, otp);

  return NextResponse.json({ valid });
}
