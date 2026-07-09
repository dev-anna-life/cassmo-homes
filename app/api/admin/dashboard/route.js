import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Fetch counts
    const membersCount = await prisma.user.count({ where: { role: "user" } });
    
    const pendingWithdrawal = await prisma.withdrawalRequest.aggregate({
      where: { status: "pending" },
      _sum: { amount: true },
    });
    
    const totalWithdrawn = await prisma.withdrawalRequest.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    });

    const pendingFunding = await prisma.fundingRequest.aggregate({
      where: { status: "pending" },
      _sum: { amount: true },
    });

    const salesCount = await prisma.sale.count();
    const totalSalesAmount = await prisma.sale.aggregate({
      _sum: { price: true },
    });

    // 2. Fetch lists for each section
    const properties = await prisma.property.findMany({ orderBy: { createdAt: "desc" } });
    
    const sales = await prisma.sale.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        property: true,
        agent: { select: { id: true, name: true } }
      }
    });

    const fundingRequests = await prisma.fundingRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true } }
      }
    });

    const withdrawalRequests = await prisma.withdrawalRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true } }
      }
    });

    const bankDetails = await prisma.user.findMany({
      where: {
        role: "user",
        OR: [
          { NOT: { bankName: null } },
          { NOT: { accountNumber: null } }
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        bankName: true,
        accountNumber: true,
        accountName: true,
      }
    });

    return NextResponse.json({
      counts: {
        members: membersCount,
        pendingWithdrawals: pendingWithdrawal._sum.amount || 0,
        totalWithdrawn: totalWithdrawn._sum.amount || 0,
        pendingFunding: pendingFunding._sum.amount || 0,
        salesCount,
        totalSales: totalSalesAmount._sum.price || 0,
      },
      properties,
      sales,
      fundingRequests,
      withdrawalRequests,
      bankDetails
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
