import transactionService from "../service/transactions-service.js";

const getAllTransactions = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const transactions = await transactionService.getAllTransactions({ limit, offset });

    res.status(200).json({
      success: true,
      data: {
        transactions,
        pagination: {
          limit,
          offset,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const createNewTransactions = async (req, res, next) => {
  try {
    const request = req.body;
    const result = await transactionService.createNewTransaction(request);
    res.status(201).json({
      message: "New Transaction created successfully",
      data: {
        transactions: result,
      },
    });
  } catch (err) {
    next(err);
  }
};

const patchTransactionById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const request = req.body;
    const result = await transactionService.updateTransactions(id, request);
    res.status(200).json({
      message: "Transaction updated successfully",
      data: {
        transactions: result,
      },
    });
  } catch (error) {
    next(error);
  }
};

const detailTransactionById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await transactionService.detailTransactions(id);

    res.status(200).json({
      message: "Transaction fetched successfully",
      data: {
        transactions: result,
      },
    });
  } catch (err) {
    next(err);
  }
};

const deleteTransactions = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Transaction ID is required" });
    }
    const result = await transactionService.deleteTransactions(id);
    if (!result) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json({
      message: "Transaction deleted successfully",
      data: {
        transaction: result,
      },
    });
  } catch (err) {
    next(err);
  }
};

export default {
  detailTransactionById,
  deleteTransactions,
  getAllTransactions,
  patchTransactionById,
  createNewTransactions,
};
