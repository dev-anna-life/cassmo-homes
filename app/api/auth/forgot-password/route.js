import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || !email.trim()) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user || user.role === "admin") {
      return NextResponse.json({ success: true });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry },
    });

    const baseUrl = process.env.NEXTAUTH_URL || "https://cassmo-homes.vercel.app";
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Cassmo Homes" <${process.env.GMAIL_USER}>`,
      to: user.email,
      subject: "Reset Your Password — Cassmo Homes",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #f9f9f9; padding: 32px; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="color: #0B3D24; margin: 0;">Cassmo Homes</h2>
          </div>
          <h3 style="color: #333;">Password Reset Request</h3>
          <p style="color: #555; line-height: 1.6;">
            Hi <strong>${user.name}</strong>,<br/><br/>
            We received a request to reset your password. Click the button below to set a new password. This link expires in <strong>1 hour</strong>.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetUrl}"
               style="background-color: #0B3D24; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 15px;">
              Reset My Password
            </a>
          </div>
          <p style="color: #888; font-size: 13px;">
            If you didn't request this, you can safely ignore this email. Your password won't change.
          </p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 24px 0;" />
          <p style="color: #aaa; font-size: 12px; text-align: center;">
            Cassmo Homes &bull; Real Estate Network
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
