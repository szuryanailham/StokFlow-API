import transactionService from "../service/transactions-service";

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

export default {
  getAllTransactions,
};
