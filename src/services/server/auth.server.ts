// src/services/server/auth.server.ts

import dbConnect from "@/lib/mongodb";
import User from "@/models/mongoose/User.schema";
import ResetToken from "@/models/mongoose/ResetToken.schema";
import { sendMail } from "@/lib/sendMail";
import crypto from "crypto";

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

//   if (!user) {
    // Silent success (security best practice)
//     return;
//   }

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
