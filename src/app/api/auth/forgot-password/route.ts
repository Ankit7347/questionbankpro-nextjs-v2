// src/app/api/auth/forgot-password/route.ts

import { NextResponse } from "next/server";
import { handleForgotPassword } from "@/services/server/auth.server";

export async function POST(req: Request) {
  const body = await req.json();

  const email =
    typeof body.email === "string" ? body.email.trim() : "";

  if (!email) {
    return NextResponse.json(
      { success: false, message: "Email is required" },
      { status: 400 }
    );
  }

  await handleForgotPassword(email);

  return NextResponse.json({
    success: true,
    message: "Reset email sent",
  });
}
