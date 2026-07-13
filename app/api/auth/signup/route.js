import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

function generateCode() {
  return String(Math.floor(10000 + Math.random() * 90000));
}

export async function POST(request) {
  try {
    const {
      name,
      username,
      email,
      password,
      phone,
      address,
      refCode,
      bankName,
      accountNumber,
      accountName,
    } = await request.json();

    if (!name || !username || !email || !password) {
      return NextResponse.json(
        { error: "Full name, username, email and password are required." },
        { status: 400 }
      );
    }

    if (!phone || !phone.trim()) {
      return NextResponse.json(
        { error: "Phone number is required." },
        { status: 400 }
      );
    }

    if (!address || !address.trim()) {
      return NextResponse.json(
        { error: "Address is required." },
        { status: 400 }
      );
    }

    if (!bankName || !accountNumber || !accountName) {
      return NextResponse.json(
        { error: "Bank name, account number and account name are required." },
        { status: 400 }
      );
    }

    if (!/^\d{10}$/.test(accountNumber)) {
      return NextResponse.json(
        { error: "Account number must be exactly 10 digits." },
        { status: 400 }
      );
    }

    if (!refCode) {
      return NextResponse.json(
        { error: "A valid referral link is required to sign up." },
        { status: 400 }
      );
    }

    const memberNum = parseInt(refCode, 10);
    const referrer = await prisma.user.findFirst({
      where: {
        OR: [
          { username: refCode.toLowerCase() },
          { referralCode: refCode.toUpperCase() },
          ...(!isNaN(memberNum) ? [{ memberNumber: memberNum }] : []),
        ],
      },
    });

    if (!referrer) {
      return NextResponse.json(
        { error: "Invalid or expired referral code." },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 400 }
      );
    }

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

    const hashedPassword = await bcrypt.hash(password, 12);
    let newRefCode = generateCode();

    while (await prisma.user.findUnique({ where: { referralCode: newRefCode } })) {
      newRefCode = generateCode();
    }

    const maxMember = await prisma.user.findFirst({
      where: { memberNumber: { not: null } },
      orderBy: { memberNumber: "desc" },
      select: { memberNumber: true },
    });
    const nextMemberNumber = (maxMember?.memberNumber ?? 0) + 1;

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        username: usernameClean,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        phone: phone.trim(),
        address: address.trim(),
        memberNumber: nextMemberNumber,
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
