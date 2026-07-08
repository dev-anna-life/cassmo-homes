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
  const existing = await prisma.user.findUnique({
    where: { email: "admin@cassmohomes.com" },
  });

  if (existing) {
    console.log("✅ Admin already exists:", existing.email);
    console.log("🔗 Admin referral code:", existing.referralCode);
    return;
  }

  const hashedPassword = await bcrypt.hash("CassmoAdmin2024!", 12);
  const referralCode = generateCode();

  const admin = await prisma.user.create({
    data: {
      name: "Adah John",
      email: "admin@cassmohomes.com",
      password: hashedPassword,
      phone: "+2349025737611",
      referralCode,
      role: "admin",
    },
  });

  console.log("✅ Admin account created!");
  console.log("📧 Email:", admin.email);
  console.log("🔑 Password: CassmoAdmin2024!");
  console.log("🔗 Referral Code:", admin.referralCode);
  console.log(
    `\n🌐 First invite link: http://localhost:3000/signup?ref=${admin.referralCode}`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
