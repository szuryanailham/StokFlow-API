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

export default {
  getItemTransactionByTransactionId,
  postNewItemTransaction,
};
