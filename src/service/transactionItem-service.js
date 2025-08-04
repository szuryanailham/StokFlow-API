import { prisma } from "../application/database";
import { ResponseError } from "../error/response-error";

const getTransactionItemsByTransactionId = async (id) => {
  const itemTransactions = await prisma.transactionItem.findMany({
    where: {
      transactionId: parseInt(id),
    },
    include: {
      product: true,
      stockMovements: true,
    },
  });
  if (!itemTransactions) {
    throw new ResponseError(404, "Transaction not found");
  }
  return itemTransactions;
};

export default {
  getTransactionItemsByTransactionId,
};
