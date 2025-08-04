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

export default {
  getItemTransactionByTransactionId,
};
