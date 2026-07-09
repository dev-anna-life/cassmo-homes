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
    const sales = await prisma.sale.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        property: true,
        agent: {
          select: { id: true, name: true, email: true },
        },
      },
    });
    return NextResponse.json({ sales });
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
    const { buyerName, propertyId, agentId, customPrice } = await req.json();
    if (!buyerName || !propertyId || !agentId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    const agent = await prisma.user.findUnique({
      where: { id: agentId },
    });

    if (!agent) {
      return NextResponse.json({ error: "Agent/Member not found" }, { status: 404 });
    }

    const price = customPrice ? parseFloat(customPrice) : property.price;
    const commissionEarned = price * (property.commissionRate / 100);

    // Create the Sale and increment the agent's walletBalance transactionally
    const result = await prisma.$transaction([
      prisma.sale.create({
        data: {
          buyerName,
          price,
          commissionEarned,
          propertyId,
          agentId,
        },
      }),
      prisma.user.update({
        where: { id: agentId },
        data: {
          walletBalance: {
            increment: commissionEarned,
          },
        },
      }),
    ]);

    return NextResponse.json({ success: true, sale: result[0] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
