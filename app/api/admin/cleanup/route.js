import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET(req) {
  return handleCleanup();
}

export async function POST(req) {
  return handleCleanup();
}

async function handleCleanup() {

  try {
    // Delete all fake seed data
    const withdrawals = await prisma.withdrawalRequest.deleteMany({});
    const funding = await prisma.fundingRequest.deleteMany({});
    const sales = await prisma.sale.deleteMany({});

    // Delete the fake test member created by seed
    const fakeUser = await prisma.user.findUnique({
      where: { email: "member@cassmohomes.com" },
    });
    let deletedUser = false;
    if (fakeUser) {
      await prisma.user.delete({ where: { email: "member@cassmohomes.com" } });
      deletedUser = true;
    }

    // Reset all user wallet balances to 0
    await prisma.user.updateMany({
      data: { walletBalance: 0, totalWithdrawn: 0 },
    });

    return NextResponse.json({
      success: true,
      deleted: {
        withdrawals: withdrawals.count,
        funding: funding.count,
        sales: sales.count,
        fakeUser: deletedUser,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
