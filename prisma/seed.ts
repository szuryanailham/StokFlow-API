import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Tambah beberapa kategori
  const elektronik = await prisma.category.upsert({
    where: { name: "Elektronik" },
    update: {},
    create: { name: "Elektronik" },
  });

  // Tambah user
  const admin = await prisma.user.upsert({
    where: { email: "admin@stokflow.test" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@stokflow.test",
    },
  });

  // Tambah item awal
  await prisma.item.create({
    data: {
      name: "Kipas Angin",
      sku: "KA001",
      stock: 10,
      buyPrice: 120000,
      sellPrice: 175000,
      categoryId: elektronik.id,
      createdById: admin.id,
    },
  });
}

main()
  .then(() => {
    console.log("✅ Seed complete");
    prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
