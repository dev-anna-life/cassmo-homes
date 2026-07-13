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
    const requests = await prisma.fundingRequest.findMany({
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

    const fundingRequest = await prisma.fundingRequest.findUnique({
      where: { id: requestId },
    });

    if (!fundingRequest) {
      return NextResponse.json({ error: "Funding request not found" }, { status: 404 });
    }

    if (fundingRequest.status !== "pending") {
      return NextResponse.json({ error: "Request has already been processed" }, { status: 400 });
    }

    if (status === "approved") {
      await prisma.$transaction([
        prisma.fundingRequest.update({
          where: { id: requestId },
          data: { status: "approved" },
        }),
        prisma.user.update({
          where: { id: fundingRequest.userId },
          data: {
            walletBalance: {
              increment: fundingRequest.amount,
            },
          },
        }),
      ]);
    } else {
      await prisma.fundingRequest.update({
        where: { id: requestId },
        data: { status: "rejected" },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
