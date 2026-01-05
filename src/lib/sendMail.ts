// src/lib/sendMail.ts

import nodemailer from "nodemailer";

export interface SendMailParams {
  to: string;
  subject: string;
  message: string;
  emailType: "forgot" | "verify" | "notification";
}

export interface SendMailResult {
  success: boolean;
  error?: string;
}

export async function sendMail({
  to,
  subject,
  message,
}: SendMailParams): Promise<SendMailResult> {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Support" <${process.env.EMAIL_ADDRESS}>`,
      to,
      subject,
      html: message,
    });

    return { success: true };
  } catch (err) {
    console.error("sendMail error:", err);

    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "Failed to send email",
    };
  }
}
