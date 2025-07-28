import { prisma } from "../application/database";

const getAllTransactions = async ({ limit, offset }) => {
  return prisma.transaction.findMany({
    skip: offset,
    take: limit,
  });
};

export default {
  getAllTransactions,
};
