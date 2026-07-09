const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function cleanup() {
  console.log("🧹 Starting cleanup of fake seed data...");

  // 1. Delete all withdrawal requests (were all fake)
  const w = await prisma.withdrawalRequest.deleteMany({});
  console.log(`✅ Deleted ${w.count} withdrawal request(s)`);

  // 2. Delete all funding requests (were all fake)
  const f = await prisma.fundingRequest.deleteMany({});
  console.log(`✅ Deleted ${f.count} funding request(s)`);

  // 3. Delete all sales (none were real)
  const s = await prisma.sale.deleteMany({});
  console.log(`✅ Deleted ${s.count} sale record(s)`);

  // 4. Delete the fake seeded test member
  const fakeUser = await prisma.user.findUnique({
    where: { email: "member@cassmohomes.com" },
  });

  if (fakeUser) {
    await prisma.user.delete({ where: { email: "member@cassmohomes.com" } });
    console.log(`✅ Deleted fake test user: member@cassmohomes.com`);
  } else {
    console.log("ℹ️  Fake test user not found (may have already been removed)");
  }

  // 5. Reset walletBalance and totalWithdrawn on all users to 0
  const updated = await prisma.user.updateMany({
    data: { walletBalance: 0, totalWithdrawn: 0 },
  });
  console.log(`✅ Reset wallet balances on ${updated.count} user(s)`);

  console.log("\n🎉 Cleanup complete! The database now has only real data.");
}

cleanup()
  .catch((e) => {
    console.error("❌ Cleanup failed:", e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
