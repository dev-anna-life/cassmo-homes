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
    const properties = await prisma.property.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ properties });
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
    const { title, location, price, commissionRate, description, imageUrl } = await req.json();
    if (!title || !location || !price || !commissionRate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const property = await prisma.property.create({
      data: {
        title,
        location,
        price: parseFloat(price),
        commissionRate: parseFloat(commissionRate),
        description,
        imageUrl,
      },
    });

    return NextResponse.json({ success: true, property });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await req.json();
    await prisma.property.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
