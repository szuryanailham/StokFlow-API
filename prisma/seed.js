const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Seed User Roles
  await prisma.userRole.createMany({
    data: [{ roleName: "admin" }, { roleName: "casier" }, { roleName: "owner" }],
    skipDuplicates: true,
  });

  // Get role IDs
  const adminRole = await prisma.userRole.findUnique({ where: { roleName: "admin" } });
  const casierRole = await prisma.userRole.findUnique({ where: { roleName: "casier" } });
  const ownerRole = await prisma.userRole.findUnique({ where: { roleName: "owner" } });

  // Seed Users
  await prisma.user.createMany({
    data: [
      {
        username: "admin01",
        email: "admin@example.com",
        passwordHash: "hashed-password-admin",
        roleId: adminRole.id,
      },
      {
        username: "casier01",
        email: "casier@example.com",
        passwordHash: "hashed-password-casier",
        roleId: casierRole.id,
      },
      {
        username: "owner01",
        email: "owner@example.com",
        passwordHash: "hashed-password-owner",
        roleId: ownerRole.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seeder berhasil dijalankan!");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error("❌ Terjadi error saat seeding:", e);
    return prisma.$disconnect().finally(() => process.exit(1));
  });
