import Joi from "joi";

const transactionTypeEnum = ["INCOME", "EXPENSE"];

export const transactionSchema = Joi.object({
  transactionCode: Joi.string().required().max(255),
  transactionType: Joi.string()
    .valid(...transactionTypeEnum)
    .required(),
  totalAmount: Joi.number().precision(2).required(),
  transactionDate: Joi.date().optional(),
  buyerSellerName: Joi.string().max(255).optional().allow(null, ""),
  notes: Joi.string().optional().allow(null, ""),
  userId: Joi.number().required(),
});
