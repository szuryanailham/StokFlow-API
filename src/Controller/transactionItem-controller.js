import { request } from "express";
import { prisma } from "../application/database";
import transactionItemService from "../service/transactionItem-service";
const getItemTransactionByTransactionId = async (req, res, next) => {
  try {
    const transactionId = parseInt(req.params.id);
    const items = await transactionItemService.getTransactionItemsByTransactionId(transactionId);

    if (!items || items.length === 0) {
      return res.status(404).json({
        message: "Transaction not found or has no items",
      });
    }

    return res.status(200).json({
      message: "Transaction items fetched successfully",
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

const postNewItemTransaction = async (req, res, next) => {
  try {
    const request = req.body;
    const transactionId = parseInt(req.params.id);

    // Validasi: Cek apakah transaction dengan ID tersebut ada
    const existingTransaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!existingTransaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    // Proses penyimpanan item transaksi
    const items = await transactionItemService.postTransactionItems(transactionId, request);

    res.status(201).json({
      message: "Transaction items created successfully",
      data: items,
    });
  } catch (err) {
    console.error("Error creating transaction items:", err);
    next(err);
  }
};

const updateTransactionItemController = async (req, res, next) => {
  try {
    const { transactionId, itemId } = req.params;

    const updatedItem = await transactionItemService.updateTransactionItems(parseInt(transactionId), parseInt(itemId), req.body);

    res.status(200).json({
      message: "Transaction item updated successfully",
      data: updatedItem,
    });
  } catch (err) {
    if (err.status === 404) {
      return next(createError(404, err.message));
    }

    return next(err);
  }
};

export default {
  getItemTransactionByTransactionId,
  postNewItemTransaction,
  updateTransactionItemController,
};
