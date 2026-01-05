// src/app/api/auth/reset/confirm/route.ts

import { NextResponse } from "next/server";
import { confirmPasswordReset } from "@/services/server/auth.server";

interface RequestBody {
  email?: string;
  otp?: string;
  password?: string;
}

export async function POST(req: Request) {
  const body = (await req.json()) as RequestBody;

  const email =
    typeof body.email === "string"
      ? body.email.trim()
      : "";

  const otp =
    typeof body.otp === "string"
      ? body.otp.trim()
      : "";

  const password =
    typeof body.password === "string"
      ? body.password
      : "";

  if (!email || !otp || !password) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid request payload",
      },
      { status: 400 }
    );
  }

  try {
    await confirmPasswordReset(email, otp, password);

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message:
          err instanceof Error
            ? err.message
            : "Password reset failed",
      },
      { status: 400 }
    );
  }
}
