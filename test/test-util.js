import { prisma } from "../src/application/database.js";
import bcrypt from "bcrypt";

export const removeTestUser = async () => {
  await prisma.user.deleteMany({
    where: {
      username: "test",
    },
  });
};

export const createTestUser = async () => {
  const hashedPassword = await bcrypt.hash("rahasia", 10);
  await prisma.user.create({
    data: {
      username: "test",
      email: "test@example.com",
      password: hashedPassword,
      token: "testtoken123",
      roleId: 1,
    },
  });
};

export const createTestProduct = async () => {
  return await prisma.product.create({
    data: {
      sku: "test12345",
      productName: "Test Product",
      description: "Test description",
      purchasePrice: 10000,
      sellingPrice: 15000,
      currentStockQty: 10,
      minStockThreshold: 3,
    },
  });
};

export const removeTestProducts = async () => {
  await prisma.product.deleteMany({
    where: {
      sku: {
        startsWith: "test",
      },
    },
  });
};
