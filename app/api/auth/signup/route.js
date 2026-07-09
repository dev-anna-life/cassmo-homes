import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

function generateCode(length = 8) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
}

export async function POST(request) {
  try {
    const {
      name,
      username,
      email,
      password,
      phone,
      refCode,
      bankName,
      accountNumber,
      accountName,
    } = await request.json();

    // Validate required fields
    if (!name || !username || !email || !password) {
      return NextResponse.json(
        { error: "Full name, username, email and password are required." },
        { status: 400 }
      );
    }

    // Validate bank details are provided
    if (!bankName || !accountNumber || !accountName) {
      return NextResponse.json(
        { error: "Bank name, account number and account name are required." },
        { status: 400 }
      );
    }

    // Validate account number is exactly 10 digits
    if (!/^\d{10}$/.test(accountNumber)) {
      return NextResponse.json(
        { error: "Account number must be exactly 10 digits." },
        { status: 400 }
      );
    }

    // Must have a valid referral code
    if (!refCode) {
      return NextResponse.json(
        { error: "A valid referral link is required to sign up." },
        { status: 400 }
      );
    }

    // Find the referrer
    const referrer = await prisma.user.findUnique({
      where: { referralCode: refCode.toUpperCase() },
    });

    if (!referrer) {
      return NextResponse.json(
        { error: "Invalid or expired referral code." },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 400 }
      );
    }

    // Check if username already taken
    const usernameClean = username.trim().toLowerCase().replace(/\s+/g, "_");
    const existingUsername = await prisma.user.findUnique({
      where: { username: usernameClean },
    });

    if (existingUsername) {
      return NextResponse.json(
        { error: "This username is already taken. Please choose another." },
        { status: 400 }
      );
    }

    // Hash password and generate unique referral code for the new user
    const hashedPassword = await bcrypt.hash(password, 12);
    let newRefCode = generateCode();

    // Ensure uniqueness
    while (await prisma.user.findUnique({ where: { referralCode: newRefCode } })) {
      newRefCode = generateCode();
    }

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        username: usernameClean,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        phone: phone?.trim() || null,
        referralCode: newRefCode,
        referredById: referrer.id,
        role: "user",
        bankName: bankName.trim(),
        accountNumber: accountNumber.trim(),
        accountName: accountName.trim(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully!",
        referralCode: user.referralCode,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
