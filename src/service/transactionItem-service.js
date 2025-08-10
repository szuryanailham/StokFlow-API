import { prisma } from "../application/database";
import { ResponseError } from "../error/response-error";
import { singleTransactionItemSchema, transactionItemSchema } from "../validation/transactionItem-validation";
import { validate } from "../validation/validation";

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

const postTransactionItems = async (transactionId, request) => {
  const transactionItems = validate(transactionItemSchema, request);

  const itemsWithTransactionId = transactionItems.map((item) => ({
    ...item,
    transactionId,
  }));

  const createdItemsTransaction = await prisma.transactionItem.createMany({
    data: itemsWithTransactionId,
    skipDuplicates: true,
  });

  return createdItemsTransaction;
};

const updateTransactionItems = async (transactionId, transactionItemId, request) => {
  const transactionItem = validate(singleTransactionItemSchema, request);

  const transactionExists = await prisma.transaction.findUnique({
    where: { id: transactionId },
  });

  if (!transactionExists) {
    const error = new Error("Transaction not found");
    throw new ResponseError(404, "Transaction not found");
  }
  const existingItem = await prisma.transactionItem.findUnique({
    where: { id: transactionItemId },
  });

  if (!existingItem) {
    throw new ResponseError(404, "Transaction item not found");
  }

  if (existingItem.transactionId !== transactionId) {
    throw new ResponseError(404, "Transaction item does not belong to the specified transaction");
  }

  const updatedItem = await prisma.transactionItem.update({
    where: {
      id: transactionItemId,
    },
    data: {
      productId: transactionItem.productId,
      quantity: transactionItem.quantity,
      unitPriceAtTransaction: transactionItem.unitPriceAtTransaction,
      subtotal: transactionItem.subtotal,
    },
  });

  return updatedItem;
};

const deleteTransactionItems = async (transactionId, transactionItemId) => {
  const transactionExists = await prisma.transaction.findUnique({
    where: { id: transactionId },
  });
  if (!transactionExists) {
    throw new ResponseError(404, "Transaction not found");
  }

  const existingItem = await prisma.transactionItem.findUnique({
    where: { id: transactionItemId },
  });

  if (!existingItem) {
    throw new ResponseError(404, "Transaction item not found");
  }

  if (existingItem.transactionId !== transactionId) {
    throw new ResponseError(404, "Transaction item does not belong to the specified transaction");
  }

  const deletedItem = await prisma.transactionItem.delete({
    where: { id: transactionItemId },
  });

  return deletedItem;
};

export default {
  getTransactionItemsByTransactionId,
  postTransactionItems,
  updateTransactionItems,
  deleteTransactionItems,
};
