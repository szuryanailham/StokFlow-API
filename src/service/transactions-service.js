import { prisma } from "../application/database.js";
import { transactionValidated, updateTransactionValidated } from "../validation/transaction-validation.js";
import { validate } from "../validation/validation.js";
import transactionItemService from "./transactionItem-service.js";
import stockMovementService from "./stockmovement-service.js";
import { ResponseError } from "../error/response-error.js";

//  ======== Get all transactions with pagination (limit & offset) ===========
const getAllTransactions = async ({ limit, offset }) => {
  return prisma.transaction.findMany({
    skip: offset,
    take: limit,
  });
};

//  =========== Create a new transaction ===========
export const createNewTransaction = async (transactionData) => {
  return await prisma.$transaction(async (tx) => {
    // Cek apakah transactionCode sudah ada
    const existingTransaction = await tx.transaction.findUnique({
      where: { transactionCode: transactionData.transactionCode },
    });

    if (existingTransaction) {
      throw new ResponseError(409, "Transaction with this code already exists");
    }

    // Buat transaksi utama
    let createTransaction = await tx.transaction.create({
      data: {
        transactionCode: transactionData.transactionCode,
        transactionType: transactionData.transactionType, // SALE / PURCHASE
        totalAmount: 0, // default
        transactionDate: new Date(transactionData.transactionDate),
        buyerSellerName: transactionData.buyerSellerName,
        notes: transactionData.notes,
        userId: transactionData.userId,
      },
    });

    let totalAmount = 0;

    if (transactionData.items && transactionData.items.length > 0) {
      const createdItems = [];

      for (const item of transactionData.items) {
        // Simpan setiap transactionItem
        const savedItem = await tx.transactionItem.create({
          data: {
            transactionId: createTransaction.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPriceAtTransaction: item.unitPriceAtTransaction,
            subtotal: item.unitPriceAtTransaction * item.quantity,
          },
        });

        createdItems.push(savedItem);

        // Ambil stok saat ini
        const product = await tx.product.findUnique({ where: { id: savedItem.productId } });

        // Hitung perubahan stok
        let stockChange = 0;
        let movementType = "OUT";

        if (createTransaction.transactionType === "SALE") {
          stockChange = -savedItem.quantity;
          movementType = "OUT";
        } else if (createTransaction.transactionType === "PURCHASE") {
          stockChange = savedItem.quantity;
          movementType = "IN";
        }

        const newStockQty = product.currentStockQty + stockChange;

        // Update stok di tabel Product
        await tx.product.update({
          where: { id: savedItem.productId },
          data: { currentStockQty: newStockQty, updatedAt: new Date() },
        });

        // Buat StockMovement
        await tx.stockMovement.create({
          data: {
            productId: savedItem.productId,
            movementType,
            quantityChanged: savedItem.quantity,
            stockAfterMovement: newStockQty,
            reason: `Transaction #${createTransaction.id}`,
            transactionItemId: savedItem.id,
            userId: transactionData.userId,
          },
        });

        // Hitung totalAmount
        totalAmount += savedItem.subtotal;
      }

      // Update totalAmount di transaksi
      createTransaction = await tx.transaction.update({
        where: { id: createTransaction.id },
        data: { totalAmount },
      });
    }

    // Return transaksi lengkap dengan items
    return await tx.transaction.findUnique({
      where: { id: createTransaction.id },
      include: { items: true },
    });
  });
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

const deleteTransactions = async (id) => {
  const numericId = parseInt(id);

  // cek apakah transaksi ada
  const existedTransactions = await prisma.transaction.findUnique({
    where: {
      id: numericId,
    },
  });

  if (!existedTransactions) {
    throw new ResponseError(404, "Transaction not found");
  }

  // update jadi soft delete
  const deletedTransaction = await prisma.transaction.update({
    where: { id: numericId },
    data: { isDeleted: true },
    select: {
      id: true,
      buyerSellerName: true,
      notes: true,
      isDeleted: true,
    },
  });

  return deletedTransaction;
};

export default {
  getAllTransactions,
  deleteTransactions,
  detailTransactions,
  createNewTransaction,
  updateTransactions,
};
