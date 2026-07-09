import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET /api/auth/referrer?ref=XXXXXXXX
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const ref = searchParams.get("ref");

    if (!ref) {
      return NextResponse.json({ error: "No ref code provided" }, { status: 400 });
    }

    const referrer = await prisma.user.findUnique({
      where: { referralCode: ref.toUpperCase() },
      select: {
        name: true,
        username: true,
      },
    });

    if (!referrer) {
      return NextResponse.json({ error: "Invalid referral code" }, { status: 404 });
    }

    return NextResponse.json({
      name: referrer.name,
      username: referrer.username,
    });
  } catch (err) {
    console.error("Referrer lookup error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
