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
    
    const properties = await prisma.property.deleteMany({});

    const sales = await prisma.sale.deleteMany({});

    const withdrawals = await prisma.withdrawalRequest.deleteMany({});
    const funding = await prisma.fundingRequest.deleteMany({});

    const fakeUser = await prisma.user.findUnique({
      where: { email: "member@cassmohomes.com" },
    });
    let deletedUser = false;
    if (fakeUser) {
      await prisma.user.delete({ where: { email: "member@cassmohomes.com" } });
      deletedUser = true;
    }

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
