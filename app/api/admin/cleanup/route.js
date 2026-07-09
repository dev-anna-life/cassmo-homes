import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Delete all properties (first image / request to remove them)
    const properties = await prisma.property.deleteMany({});

    // Delete all sales
    const sales = await prisma.sale.deleteMany({});

    // Delete all fake seed request data
    const withdrawals = await prisma.withdrawalRequest.deleteMany({});
    const funding = await prisma.fundingRequest.deleteMany({});

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
        properties: properties.count,
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
