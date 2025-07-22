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
