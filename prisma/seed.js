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
  // 1. Create Admin
  let admin = await prisma.user.findUnique({
    where: { email: "admin@cassmohomes.com" },
  });

  if (!admin) {
    const hashedPassword = await bcrypt.hash("CassmoAdmin2024!", 12);
    const referralCode = generateCode();

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
  } else {
    console.log("✅ Admin already exists:", admin.email);
  }

  // 2. Create standard test user if not exists
  let testUser = await prisma.user.findUnique({
    where: { email: "member@cassmohomes.com" },
  });

  if (!testUser) {
    const hashedPassword = await bcrypt.hash("Member123!", 12);
    const referralCode = generateCode();

    testUser = await prisma.user.create({
      data: {
        name: "Annastesia Amarachi Ugwuanyi",
        email: "member@cassmohomes.com",
        password: hashedPassword,
        phone: "09048095365",
        referralCode,
        referredById: admin.id,
        role: "user",
        walletBalance: 150000,
        totalWithdrawn: 50000,
        bankName: "Zenith Bank",
        accountNumber: "2210984756",
        accountName: "Annastesia A. Ugwuanyi",
      },
    });
    console.log("✅ Test Member created!");
  }

  // 3. Seed Properties
  const propertiesCount = await prisma.property.count();
  if (propertiesCount === 0) {
    await prisma.property.createMany({
      data: [
        {
          title: "Cassmo Estate Phase 1",
          location: "Asokoro Extension, Abuja",
          price: 15000000.0,
          commissionRate: 10.0,
          description: "Premium fully serviced serviced estate plots with C of O.",
          imageUrl: "/images/flyer-freedom.png",
        },
        {
          title: "Keystone Heights",
          location: "Karsana East, Abuja",
          price: 8500000.0,
          commissionRate: 12.0,
          description: "Serene environment perfect for duplex development.",
          imageUrl: "/images/flyer-keystone.png",
        },
        {
          title: "Freedom Court Plots",
          location: "Lugbe Near Airport Road, Abuja",
          price: 5000000.0,
          commissionRate: 15.0,
          description: "Fast-developing area ideal for immediate building.",
          imageUrl: "/images/flyer-landvalue.png",
        },
      ],
    });
    console.log("✅ Seeding properties complete!");
  }

  // 4. Seed Funding Requests
  const fundingCount = await prisma.fundingRequest.count();
  if (fundingCount === 0 && testUser) {
    await prisma.fundingRequest.createMany({
      data: [
        {
          userId: testUser.id,
          amount: 250000.0,
          reference: "TXN-736485",
          status: "pending",
        },
        {
          userId: testUser.id,
          amount: 500000.0,
          reference: "TXN-827495",
          status: "approved",
        },
      ],
    });
    console.log("✅ Seeding funding requests complete!");
  }

  // 5. Seed Withdrawal Requests
  const withdrawalCount = await prisma.withdrawalRequest.count();
  if (withdrawalCount === 0 && testUser) {
    await prisma.withdrawalRequest.createMany({
      data: [
        {
          userId: testUser.id,
          amount: 50000.0,
          bankName: "Zenith Bank",
          accountNumber: "2210984756",
          accountName: "Annastesia A. Ugwuanyi",
          status: "pending",
        },
        {
          userId: testUser.id,
          amount: 10000.0,
          bankName: "Zenith Bank",
          accountNumber: "2210984756",
          accountName: "Annastesia A. Ugwuanyi",
          status: "completed",
        },
      ],
    });
    console.log("✅ Seeding withdrawal requests complete!");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
