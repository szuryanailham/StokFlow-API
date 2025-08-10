import { empty } from "@prisma/client/runtime/library";
import stockMovementService from "../service/stockmovement-service";

const getAllStockMovement = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const data = await stockMovementService.getAllStockMovement({ limit, offset });

    return res.status(200).json({
      status: "success",
      message: "Stock movements fetched successfully",
      data,
    });
  } catch (err) {
    next(err);
  }
};

const getStockMovementByProduct = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id, 10);
    const historyProduct = await stockMovementService.getStokMovementByProduct(productId);

    if (historyProduct.length === 0) {
      return res.status(404).json({ errors: "No stock movements found for this product." });
    }

    return res.status(200).json(historyProduct);
  } catch (err) {
    next(err);
  }
};

export default {
  getAllStockMovement,
  getStockMovementByProduct,
};
