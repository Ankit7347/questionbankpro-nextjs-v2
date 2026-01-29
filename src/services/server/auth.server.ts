// src/services/server/auth.server.ts

import dbConnect from "@/lib/mongodb";
import User from "@/models/mongoose/User.schema";
import ResetToken from "@/models/mongoose/ResetToken.schema";
import { sendMail } from "@/lib/sendMail";
import crypto from "crypto";
import bcrypt from "bcryptjs";

/* ---------------------------------- */
/* Forgot Password                    */
/* ---------------------------------- */

export async function handleForgotPassword(
  email: string
): Promise<void> {
  await dbConnect();

  const user = await User.findOne({
    email,
    isDeleted: false,
  }).lean();

  if (!user) {
    // Silent success (security best practice)
    return;
  }

  const otp = crypto.randomInt(100000, 999999).toString();

  await ResetToken.create({
    email,
    token: otp,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?email=${email}&otp=${otp}`;

  await sendMail({
    to: email,
    subject: "Reset Your Password",
    message: resetUrl,
    emailType: "forgot",
  });
}

export async function validateResetToken(
  email: string,
  otp: string
): Promise<boolean> {
  await dbConnect();

  const token = await ResetToken.findOne({
    email,
    token: otp,
  }).lean();

  return Boolean(token);
}

export async function confirmPasswordReset(
  email: string,
  otp: string,
  newPassword: string
): Promise<void> {
  await dbConnect();

  // 1. Validate reset token
  const token = await ResetToken.findOne({
    email,
    token: otp, // IMPORTANT: field name
  });

  if (!token) {
    throw new Error("Invalid or expired reset token");
  }

  // 2. Hash new password
  const passwordHash = await bcrypt.hash(newPassword, 12);

  // 3. Update user password
  const result = await User.updateOne(
    { email, isDeleted: false },
    { $set: { passwordHash } }
  );

  if (result.matchedCount === 0) {
    throw new Error("User not found");
  }

  // 4. Invalidate token (one-time use)
  await ResetToken.deleteOne({ _id: token._id });
}

