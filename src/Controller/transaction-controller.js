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

const createNewTransactions = async (req, res, next) => {
  try {
    const request = req.body;
    const result = await transactionService.createNewTransactions(request);

    res.status(201).json({
      message: "New Transaction created successfully",
      data: {
        product: result,
      },
    });
  } catch (err) {
    next(err);
  }
};

export default {
  getAllTransactions,
  createNewTransactions,
};
