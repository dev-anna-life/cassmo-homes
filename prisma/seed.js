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
  // Only create the admin account — never create fake test users
  let admin = await prisma.user.findUnique({
    where: { email: "admin@cassmohomes.com" },
  });

  if (admin) {
    console.log("✅ Admin already exists:", admin.email);
    console.log("🔗 Admin referral code:", admin.referralCode);
    return;
  }

  const hashedPassword = await bcrypt.hash("CassmoAdmin2024!", 12);
  let referralCode;
  do {
    referralCode = generateCode();
  } while (await prisma.user.findUnique({ where: { referralCode } }));

  admin = await prisma.user.create({
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
