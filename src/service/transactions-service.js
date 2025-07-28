import { prisma } from "../application/database";
import { ResponseError } from "../error/response-error";
import { transactionValidated } from "../validation/transaction-validation";
import { validate } from "../validation/validation";
const getAllTransactions = async ({ limit, offset }) => {
  return prisma.transaction.findMany({
    skip: offset,
    take: limit,
  });
};

const createNewTransactions = async (request) => {
  const transaction = validate(transactionValidated, request);

  const user = await prisma.user.findUnique({ where: { id: transaction.userId } });

  if (!user) {
    throw new ResponseError(404, "User not found");
  }

  const existingTransaction = await prisma.transaction.findUnique({
    where: { transactionCode: transaction.transactionCode },
  });
  if (existingTransaction) {
    throw new ResponseError(409, "Transaction with this code already exists");
  }

  const createTransaction = await prisma.transaction.create({
    data: transaction,
    select: {
      id: true,
      transactionCode: true,
      transactionType: true,
      totalAmount: true,
      transactionDate: true,
      buyerSellerName: true,
      notes: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return createTransaction;
};

export default {
  getAllTransactions,
  createNewTransactions,
};
