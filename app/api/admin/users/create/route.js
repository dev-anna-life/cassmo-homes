import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

function generateCode() {
  return String(Math.floor(10000 + Math.random() * 90000));
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, username, email, password, phone } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 });
    }

    let usernameToUse = username?.trim()
      ? username.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_")
      : name.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");

    let finalUsername = usernameToUse;
    let counter = 1;
    while (await prisma.user.findUnique({ where: { username: finalUsername } })) {
      finalUsername = `${usernameToUse}${counter}`;
      counter++;
    }

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (existing) {
      return NextResponse.json({ error: "A member with this email already exists" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 12);
    let referralCode;
    do {
      referralCode = generateCode();
    } while (await prisma.user.findUnique({ where: { referralCode } }));

    const user = await prisma.user.create({
      data: {
        name,
        username: finalUsername,
        email: email.toLowerCase().trim(),
        password: hashed,
        phone: phone || null,
        referralCode,
        role: "user",
      },
    });

    return NextResponse.json({ success: true, userId: user.id, username: finalUsername });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
