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

  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: [
      {
        id: 1,
        sku: "SKU001",
        productName: "Product A",
        description: "Description A",
        purchasePrice: 5000.0,
        sellingPrice: 10000.0,
        currentStockQty: 50,
        minStockThreshold: 5,
      },
      {
        id: 2,
        sku: "SKU002",
        productName: "Product B",
        description: "Description B",
        purchasePrice: 8000.0,
        sellingPrice: 12000.0,
        currentStockQty: 30,
        minStockThreshold: 3,
      },
      {
        id: 3,
        sku: "SKU003",
        productName: "Product C",
        description: "Description C",
        purchasePrice: 7000.0,
        sellingPrice: 11000.0,
        currentStockQty: 20,
        minStockThreshold: 2,
      },
    ],
  });
  await prisma.transaction.deleteMany();

  await prisma.transaction.createMany({
    data: [
      {
        id: 1,
        transactionCode: "TRX001",
        transactionType: "PURCHASE",
        totalAmount: 150000,
        buyerSellerName: "PT Sumber Rejeki",
        notes: "Pembelian stok awal",
        isDeleted: false,
        userId: 2,
      },
      {
        id: 2,
        transactionCode: "TRX002",
        transactionType: "PURCHASE",
        totalAmount: 150000,
        buyerSellerName: "PT Sumber Rejeki",
        notes: "Pembelian stok awal",
        isDeleted: false,
        userId: 2,
      },
    ],
  });
  console.log("✅ Seeder berhasil dijalankan!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
