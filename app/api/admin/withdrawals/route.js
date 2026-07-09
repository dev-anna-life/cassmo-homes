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
    const requests = await prisma.withdrawalRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
    return NextResponse.json({ requests });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { requestId, status } = await req.json();
    if (!requestId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const request = await prisma.withdrawalRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      return NextResponse.json({ error: "Withdrawal request not found" }, { status: 404 });
    }

    if (request.status !== "pending") {
      return NextResponse.json({ error: "Request already processed" }, { status: 400 });
    }

    if (status === "completed") {
      // Transactional: complete withdrawal, add to user's totalWithdrawn
      await prisma.$transaction([
        prisma.withdrawalRequest.update({
          where: { id: requestId },
          data: { status: "completed" },
        }),
        prisma.user.update({
          where: { id: request.userId },
          data: {
            totalWithdrawn: {
              increment: request.amount,
            },
          },
        }),
      ]);
    } else if (status === "cancelled") {
      // Refund user's walletBalance on cancellation/rejection
      await prisma.$transaction([
        prisma.withdrawalRequest.update({
          where: { id: requestId },
          data: { status: "cancelled" },
        }),
        prisma.user.update({
          where: { id: request.userId },
          data: {
            walletBalance: {
              increment: request.amount,
            },
          },
        }),
      ]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
