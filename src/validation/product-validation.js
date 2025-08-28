import Joi from "joi";

const createProductValidation = Joi.object({
  productName: Joi.string().max(255).required(),
  description: Joi.string().allow(null, "").max(1000),
  purchasePrice: Joi.number().precision(2).min(0).required(),
  sellingPrice: Joi.number().precision(2).min(0).required(),
  currentStockQty: Joi.number().integer().min(0).required(),
  minStockThreshold: Joi.number().integer().min(0).required(),
}).unknown(false);

export { createProductValidation };
