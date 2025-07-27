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
      // 5 produk awal
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

      // 15 produk tambahan
      {
        sku: "SKU006",
        productName: "Gaming Chair Pro",
        description: "Ergonomic gaming chair with adjustable height and lumbar support",
        purchasePrice: 1500000,
        sellingPrice: 2000000,
        currentStockQty: 10,
        minStockThreshold: 2,
      },
      {
        sku: "SKU007",
        productName: "Portable Projector",
        description: "Mini projector with 1080p resolution for home theater",
        purchasePrice: 900000,
        sellingPrice: 1300000,
        currentStockQty: 12,
        minStockThreshold: 3,
      },
      {
        sku: "SKU008",
        productName: "Smartphone Stand Adjustable",
        description: "Universal stand for phones and tablets",
        purchasePrice: 50000,
        sellingPrice: 80000,
        currentStockQty: 70,
        minStockThreshold: 10,
      },
      {
        sku: "SKU009",
        productName: "Wireless Charger Pad",
        description: "Fast wireless charging pad for all Qi-enabled devices",
        purchasePrice: 100000,
        sellingPrice: 160000,
        currentStockQty: 40,
        minStockThreshold: 6,
      },
      {
        sku: "SKU010",
        productName: "Noise Cancelling Headphones",
        description: "Over-ear headphones with ANC technology",
        purchasePrice: 700000,
        sellingPrice: 1000000,
        currentStockQty: 25,
        minStockThreshold: 5,
      },
      {
        sku: "SKU011",
        productName: "Webcam Full HD 1080p",
        description: "High-quality webcam with built-in microphone",
        purchasePrice: 300000,
        sellingPrice: 450000,
        currentStockQty: 35,
        minStockThreshold: 7,
      },
      {
        sku: "SKU012",
        productName: "Laptop Cooling Pad",
        description: "Cooling pad with 5 fans and adjustable height",
        purchasePrice: 120000,
        sellingPrice: 180000,
        currentStockQty: 20,
        minStockThreshold: 4,
      },
      {
        sku: "SKU013",
        productName: "Gaming Mousepad XL",
        description: "Large mousepad with RGB lighting",
        purchasePrice: 70000,
        sellingPrice: 120000,
        currentStockQty: 45,
        minStockThreshold: 6,
      },
      {
        sku: "SKU014",
        productName: "Bluetooth Speaker Waterproof",
        description: "Portable speaker with deep bass and waterproof design",
        purchasePrice: 250000,
        sellingPrice: 350000,
        currentStockQty: 30,
        minStockThreshold: 5,
      },
      {
        sku: "SKU015",
        productName: "LED Desk Lamp",
        description: "Adjustable LED lamp with touch control and USB port",
        purchasePrice: 150000,
        sellingPrice: 220000,
        currentStockQty: 18,
        minStockThreshold: 3,
      },
      {
        sku: "SKU016",
        productName: "USB Flash Drive 128GB",
        description: "High-speed USB 3.0 flash drive for fast data transfer",
        purchasePrice: 100000,
        sellingPrice: 160000,
        currentStockQty: 55,
        minStockThreshold: 10,
      },
      {
        sku: "SKU017",
        productName: "Wi-Fi Repeater 300Mbps",
        description: "Extend your wireless network with ease",
        purchasePrice: 180000,
        sellingPrice: 250000,
        currentStockQty: 22,
        minStockThreshold: 4,
      },
      {
        sku: "SKU018",
        productName: "Smartwatch Fitness Tracker",
        description: "Track your activity and health metrics",
        purchasePrice: 400000,
        sellingPrice: 600000,
        currentStockQty: 28,
        minStockThreshold: 6,
      },
      {
        sku: "SKU019",
        productName: "Laptop Sleeve 15 Inch",
        description: "Protective neoprene sleeve for laptops",
        purchasePrice: 80000,
        sellingPrice: 130000,
        currentStockQty: 33,
        minStockThreshold: 5,
      },
      {
        sku: "SKU020",
        productName: "Graphic Tablet with Pen",
        description: "Digital drawing tablet with pressure-sensitive pen",
        purchasePrice: 500000,
        sellingPrice: 750000,
        currentStockQty: 16,
        minStockThreshold: 3,
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
