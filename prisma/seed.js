const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

function generateCode(length = 8) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
}

async function main() {
  console.log("🗑️  Wiping all existing users...");
  await prisma.user.deleteMany({});
  console.log("✅ All users deleted.");

  const hashedPassword = await bcrypt.hash("CassmoAdmin2026!", 12);
  let referralCode;
  do {
    referralCode = generateCode();
  } while (await prisma.user.findUnique({ where: { referralCode } }));

  const admin = await prisma.user.create({
    data: {
      name: "Adah John",
      username: "admin",
      email: "admin@cassmohomes.com",
      password: hashedPassword,
      phone: "+2349025737611",
      referralCode,
      role: "admin",
      memberNumber: null,
    },
  });

  console.log("✅ Fresh admin account created!");
  console.log("📧 Email:", admin.email);
  console.log("👤 Username: admin");
  console.log("🔑 Password: CassmoAdmin2026!");
  console.log("🔗 Referral Code:", admin.referralCode);
  console.log("ℹ️  Admin has no member number — first signup will be Member #1");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
