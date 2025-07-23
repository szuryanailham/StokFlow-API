import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // 1. Seed UserRole
  const adminRole = await prisma.userRole.upsert({
    where: { roleName: "admin" },
    update: {},
    create: {
      roleName: "admin",
    },
  });

  const casierRole = await prisma.userRole.upsert({
    where: { roleName: "cashier" },
    update: {},
    create: {
      roleName: "cashier",
    },
  });

  const ownerRole = await prisma.userRole.upsert({
    where: { roleName: "owner" },
    update: {},
    create: {
      roleName: "owner",
    },
  });

  // 2. Hash password
  const hashedPassword = await bcrypt.hash("testpassword123", 10);

  // 3. Seed User
  await prisma.user.upsert({
    where: { email: "admin@stokflow.com" },
    update: {},
    create: {
      username: "admin",
      email: "admin@stokflow.com",
      password: hashedPassword,
      token: "default-token-admin",
      roleId: adminRole.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "staff@stokflow.com" },
    update: {},
    create: {
      username: "casier",
      email: "staff@stokflow.com",
      password: hashedPassword,
      token: "default-token-staff",
      roleId: casierRole.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "staff@stokflow.com" },
    update: {},
    create: {
      username: "owner",
      email: "owner@stokflow.com",
      password: hashedPassword,
      token: "default-token-staff",
      roleId: ownerRole.id,
    },
  });

  await prisma.product.createMany({
    data: [
      {
        sku: "SKU001",
        productName: "Logitech Wireless Mouse",
        description: "Wireless mouse with ergonomic design and long battery life",
        purchasePrice: 100000,
        sellingPrice: 150000,
        currentStockQty: 50,
        minStockThreshold: 10,
      },
      {
        sku: "SKU002",
        productName: "Mechanical Keyboard RGB",
        description: "Mechanical keyboard with RGB lighting and blue switches",
        purchasePrice: 300000,
        sellingPrice: 500000,
        currentStockQty: 30,
        minStockThreshold: 5,
      },
      {
        sku: "SKU003",
        productName: "27 Inch 4K Monitor",
        description: "UHD monitor with 75Hz refresh rate",
        purchasePrice: 2500000,
        sellingPrice: 3500000,
        currentStockQty: 15,
        minStockThreshold: 2,
      },
      {
        sku: "SKU004",
        productName: "External SSD 1TB",
        description: "High-speed external SSD for data backup",
        purchasePrice: 1200000,
        sellingPrice: 1800000,
        currentStockQty: 20,
        minStockThreshold: 4,
      },
      {
        sku: "SKU005",
        productName: "USB-C Hub 7 Port",
        description: "Multifunctional hub with 7 ports and HDMI support",
        purchasePrice: 250000,
        sellingPrice: 400000,
        currentStockQty: 60,
        minStockThreshold: 8,
      },
    ],
  });

  console.log("✅ Seeder selesai");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
