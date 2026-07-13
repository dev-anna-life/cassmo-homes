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
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const target = await prisma.user.findUnique({ where: { id: userId } });
    if (!target) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (target.role === "admin") {
      return NextResponse.json({ error: "Cannot delete an admin account" }, { status: 403 });
    }

    await prisma.fundingRequest.deleteMany({ where: { userId } });
    await prisma.withdrawalRequest.deleteMany({ where: { userId } });
    await prisma.sale.deleteMany({ where: { agentId: userId } });

    await prisma.user.updateMany({
      where: { referredById: userId },
      data: { referredById: null },
    });

    await prisma.user.delete({ where: { id: userId } });

    return NextResponse.json({ success: true, message: "Member deleted successfully." });
  } catch (err) {
    console.error("Delete user error:", err);
    return NextResponse.json({ error: "Failed to delete member." }, { status: 500 });
  }
}
