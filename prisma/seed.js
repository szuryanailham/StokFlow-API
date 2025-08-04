import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // 1. Seed UserRole
  const [adminRole, casierRole, ownerRole] = await Promise.all([
    prisma.userRole.upsert({
      where: { roleName: "admin" },
      update: {},
      create: { roleName: "admin" },
    }),
    prisma.userRole.upsert({
      where: { roleName: "cashier" },
      update: {},
      create: { roleName: "cashier" },
    }),
    prisma.userRole.upsert({
      where: { roleName: "owner" },
      update: {},
      create: { roleName: "owner" },
    }),
  ]);

  // 2. Hash password
  const hashedPassword = await bcrypt.hash("testpassword123", 10);

  // 3. Seed Users
  await Promise.all([
    prisma.user.upsert({
      where: { email: "admin@stokflow.com" },
      update: {},
      create: {
        username: "admin",
        email: "admin@stokflow.com",
        password: hashedPassword,
        token: "default-token-admin",
        roleId: adminRole.id,
      },
    }),
    prisma.user.upsert({
      where: { email: "staff@stokflow.com" },
      update: {},
      create: {
        username: "casier",
        email: "staff@stokflow.com",
        password: hashedPassword,
        token: "default-token-staff",
        roleId: casierRole.id,
      },
    }),
    prisma.user.upsert({
      where: { email: "owner@stokflow.com" },
      update: {},
      create: {
        username: "owner",
        email: "owner@stokflow.com",
        password: hashedPassword,
        token: "default-token-owner",
        roleId: ownerRole.id,
      },
    }),
  ]);

  // 4. Bersihkan data lama secara berurutan
  await prisma.transactionItem.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.product.deleteMany();

  // 5. Seed Products
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

  // 6. Seed Transactions
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

  // 7. Seed Transaction Items
  await prisma.transactionItem.createMany({
    data: [
      {
        transactionId: 1,
        productId: 1,
        quantity: 2,
        unitPriceAtTransaction: 15000,
        subtotal: 30000,
      },
      {
        transactionId: 1,
        productId: 1,
        quantity: 1,
        unitPriceAtTransaction: 20000,
        subtotal: 20000,
      },
      {
        transactionId: 2,
        productId: 2,
        quantity: 3,
        unitPriceAtTransaction: 10000,
        subtotal: 30000,
      },
    ],
  });

  console.log("✅ Seeder berhasil dijalankan!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
