import Joi from "joi";

const transactionTypeEnum = ["SALE", "PURCHASE"];

const transactionValidated = Joi.object({
  transactionCode: Joi.string().required().max(255),
  transactionType: Joi.string()
    .valid(...transactionTypeEnum)
    .required(),
  totalAmount: Joi.number().precision(2).required(),
  transactionDate: Joi.date().optional(),
  buyerSellerName: Joi.string().max(255).optional().allow(null, ""),
  notes: Joi.string().optional().allow(null, ""),
  userId: Joi.number().required(),
}).unknown(false);

export const updateTransactionValidated = Joi.object({
  buyerSellerName: Joi.string().optional().allow(null, ""),
  notes: Joi.string().optional().allow(null, ""),
});

export { transactionValidated };
