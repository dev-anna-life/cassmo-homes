import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET /api/auth/referrer?ref=admin (username) or ?ref=1 (member number) or ?ref=YOKAV6S2 (referral code)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const ref = searchParams.get("ref")?.trim();

    if (!ref) {
      return NextResponse.json({ error: "No ref provided" }, { status: 400 });
    }

    let referrer = null;

    // 1. Try by member number first (if ref is a number)
    const memberNum = parseInt(ref, 10);
    if (!isNaN(memberNum) && String(memberNum) === ref) {
      referrer = await prisma.user.findUnique({
        where: { memberNumber: memberNum },
        select: {
          name: true,
          username: true,
          referralCode: true,
          memberNumber: true,
        },
      });
    }

    // 2. Try by username (case-insensitive)
    if (!referrer) {
      referrer = await prisma.user.findFirst({
        where: { username: ref.toLowerCase() },
        select: {
          name: true,
          username: true,
          referralCode: true,
          memberNumber: true,
        },
      });
    }

    // 3. Fallback: try by referral code (case-insensitive)
    if (!referrer) {
      referrer = await prisma.user.findFirst({
        where: { referralCode: ref.toUpperCase() },
        select: {
          name: true,
          username: true,
          referralCode: true,
          memberNumber: true,
        },
      });
    }

    if (!referrer) {
      return NextResponse.json({ error: "Invalid referral link" }, { status: 404 });
    }

    return NextResponse.json({
      name: referrer.name,
      username: referrer.username,
      referralCode: referrer.referralCode,
      memberNumber: referrer.memberNumber,
    });
  } catch (err) {
    console.error("Referrer lookup error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
