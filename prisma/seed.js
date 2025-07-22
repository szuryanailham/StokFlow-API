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
