import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
  // Temporarily open
  /*
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  */

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      referralCode: true,
      role: true,
      createdAt: true,
      referredBy: {
        select: { id: true, name: true, email: true },
      },
      referredUsers: {
        select: { id: true, name: true, email: true, createdAt: true },
      },
    },
  });

  return NextResponse.json({ users, count: users.length });
}
