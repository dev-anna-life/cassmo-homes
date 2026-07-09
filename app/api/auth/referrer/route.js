import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET /api/auth/referrer?ref=USERNAME_OR_REFCODE
// Accepts: @username (e.g. "annastesia") or a referral code (e.g. "98VTQF6C")
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const ref = searchParams.get("ref")?.trim();

    if (!ref) {
      return NextResponse.json({ error: "No ref provided" }, { status: 400 });
    }

    // Try by username first (case-insensitive), then by referral code
    const referrer = await prisma.user.findFirst({
      where: {
        OR: [
          { username: ref.toLowerCase() },
          { referralCode: ref.toUpperCase() },
        ],
      },
      select: {
        name: true,
        username: true,
        referralCode: true,
      },
    });

    if (!referrer) {
      return NextResponse.json({ error: "Invalid referral code or username" }, { status: 404 });
    }

    return NextResponse.json({
      name: referrer.name,
      username: referrer.username,
      referralCode: referrer.referralCode,
    });
  } catch (err) {
    console.error("Referrer lookup error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
