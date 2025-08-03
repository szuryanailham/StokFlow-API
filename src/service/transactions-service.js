import { request } from "express";
import { prisma } from "../application/database";
import { ResponseError } from "../error/response-error";
import { transactionValidated, updateTransactionValidated } from "../validation/transaction-validation";
import { validate } from "../validation/validation";

//  ======== Get all transactions with pagination (limit & offset) ===========
const getAllTransactions = async ({ limit, offset }) => {
  return prisma.transaction.findMany({
    skip: offset, // Skip number of records (offset)
    take: limit, // Take number of records (limit)
  });
};

//  =========== Create a new transaction ===========
const createNewTransactions = async (request) => {
  // Validate the request body using Joi schema
  const transaction = validate(transactionValidated, request);

  // Check if the user exists by userId
  const user = await prisma.user.findUnique({ where: { id: transaction.userId } });
  if (!user) {
    throw new ResponseError(404, "User not found");
  }

  // Check if the transaction code already exists (unique constraint)
  const existingTransaction = await prisma.transaction.findUnique({
    where: { transactionCode: transaction.transactionCode },
  });
  if (existingTransaction) {
    throw new ResponseError(409, "Transaction with this code already exists");
  }

  // Create and return the new transaction
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

//  ====== Update an existing transaction by ID ===========
const updateTransactions = async (id, request) => {
  const numericId = Number(id); // Convert ID to number

  // Validate the update request body
  const transactions = validate(updateTransactionValidated, request);

  // Check if the transaction exists
  const existingTransaction = await prisma.transaction.findUnique({
    where: { id: numericId },
  });

  if (!existingTransaction) {
    throw new ResponseError(404, "Transaction not found");
  }

  // Update and return the transaction
  const updatedTransaction = await prisma.transaction.update({
    where: { id: numericId },
    data: transactions,
    select: {
      buyerSellerName: true,
      notes: true,
    },
  });

  return updatedTransaction;
};

//  ============ Get transaction detail by ID ================
const detailTransactions = async (id) => {
  const detailTransactions = await prisma.transaction.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!detailTransactions) {
    throw new ResponseError(404, "Transaction not found");
  }

  return detailTransactions;
};

// Export all transaction services
export default {
  getAllTransactions,
  detailTransactions,
  createNewTransactions,
  updateTransactions,
};
