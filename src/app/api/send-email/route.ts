import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

interface SendEmailBody {
  to: string;
  subject: string;
  message: string;
  emailType: string;
}

export async function POST(req: Request) {
  try {
    const body: SendEmailBody = await req.json();
    const { to, subject, message, emailType } = body;

    if (!to || !subject || !message || !emailType) {
      return NextResponse.json(
        { error: "Missing required fields: to, subject, message, or emailType" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let htmlBody = "";

    if (emailType === "forgot") {
      htmlBody = `
        <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
          <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
            <h2 style="color: #2c3e50;">Password Reset Request</h2>
            <p>Dear User,</p>
            <p>We received a request to reset the password associated with this email address: <strong>${to}</strong>.</p>
            <p>If you initiated this request, please follow the instructions below. If not, you can safely ignore this email — no changes will be made to your account.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${message}" style="padding: 12px 25px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Your Password</a>
            </div>
            <p>This link will expire in 30 minutes for your security. If it has expired, please try resetting again.</p>
            <p>Thank you,<br/>Support Team</p>
            <hr style="margin: 30px 0;" />
            <p style="font-size: 12px; color: #888888;">This is an automated message. Please do not reply directly to this email.</p>
          </div>
        </div>
      `;
    } else {
      htmlBody = `
        <div style="font-family:sans-serif; padding:20px;">
          <h3>${subject}</h3>
          <p>${message}</p>
          <small style="color:gray;">Email type: ${emailType}</small>
        </div>
      `;
    }

    await transporter.sendMail({
      from: `"Support" <${process.env.EMAIL_ADDRESS}>`,
      to,
      subject,
      html: htmlBody,
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Email sending failed:", error);
    const message =
      error instanceof Error ? error.message : "Unknown server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
