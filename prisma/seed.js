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

  const products = await prisma.product.createMany({
    data: [
      {
        sku: "SKU001",
        productName: "Product A",
        description: "Description A",
        purchasePrice: 5000.0,
        sellingPrice: 10000.0,
        currentStockQty: 50,
        minStockThreshold: 5,
      },
      {
        sku: "SKU002",
        productName: "Product B",
        description: "Description B",
        purchasePrice: 8000.0,
        sellingPrice: 12000.0,
        currentStockQty: 30,
        minStockThreshold: 3,
      },
      {
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
        transactionCode: "TRX001",
        transactionType: "PURCHASE",
        totalAmount: 150000,
        buyerSellerName: "PT Sumber Rejeki",
        notes: "Pembelian stok awal",
        userId: 2,
      },
      {
        transactionCode: "TRX002",
        transactionType: "SALE",
        totalAmount: 100000,
        buyerSellerName: "CV Amanah Jaya",
        notes: "Penjualan ke distributor",
        userId: 2,
      },
      {
        transactionCode: "TRX003",
        transactionType: "SALE",
        totalAmount: 50000,
        buyerSellerName: "End Customer",
        notes: "Penjualan retail langsung",
        userId: 2,
      },
      {
        transactionCode: "TRX004",
        transactionType: "PURCHASE",
        totalAmount: 200000,
        buyerSellerName: "PT Makmur Sentosa",
        notes: "Pembelian alat produksi",
        userId: 2,
      },
      {
        transactionCode: "TRX005",
        transactionType: "SALE",
        totalAmount: 120000,
        buyerSellerName: "Toko Grosir Abadi",
        notes: "Penjualan dalam kota",
        userId: 2,
      },
      {
        transactionCode: "TRX006",
        transactionType: "PURCHASE",
        totalAmount: 175000,
        buyerSellerName: "Supplier Nusantara",
        notes: "Bahan baku tambahan",
        userId: 2,
      },
      {
        transactionCode: "TRX007",
        transactionType: "SALE",
        totalAmount: 130000,
        buyerSellerName: "CV Harapan Baru",
        notes: "Penjualan luar kota",
        userId: 2,
      },
      {
        transactionCode: "TRX008",
        transactionType: "SALE",
        totalAmount: 95000,
        buyerSellerName: "Retail Customer A",
        notes: "Penjualan retail",
        userId: 2,
      },
      {
        transactionCode: "TRX009",
        transactionType: "PURCHASE",
        totalAmount: 300000,
        buyerSellerName: "PT Mega Persada",
        notes: "Stok gudang besar",
        userId: 2,
      },
      {
        transactionCode: "TRX010",
        transactionType: "SALE",
        totalAmount: 85000,
        buyerSellerName: "Retail Customer B",
        notes: "Penjualan langsung",
        userId: 2,
      },
      {
        transactionCode: "TRX011",
        transactionType: "SALE",
        totalAmount: 110000,
        buyerSellerName: "CV Usaha Mandiri",
        notes: "Penjualan ke reseller",
        userId: 2,
      },
      {
        transactionCode: "TRX012",
        transactionType: "PURCHASE",
        totalAmount: 220000,
        buyerSellerName: "PT Sinar Gemilang",
        notes: "Restock mingguan",
        userId: 2,
      },
      {
        transactionCode: "TRX013",
        transactionType: "SALE",
        totalAmount: 105000,
        buyerSellerName: "End Customer C",
        notes: "Penjualan reguler",
        userId: 2,
      },
      {
        transactionCode: "TRX014",
        transactionType: "PURCHASE",
        totalAmount: 160000,
        buyerSellerName: "PT Logistik Cepat",
        notes: "Biaya logistik",
        userId: 2,
      },
      {
        transactionCode: "TRX015",
        transactionType: "SALE",
        totalAmount: 140000,
        buyerSellerName: "Distributor XYZ",
        notes: "Distribusi nasional",
        userId: 2,
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
