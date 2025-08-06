import Joi from "joi";

const singleTransactionItemSchema = Joi.object({
  productId: Joi.number().integer().positive().required().messages({
    "number.base": "Product ID must be a number.",
    "number.positive": "Product ID must be greater than 0.",
    "any.required": "Product ID is required.",
  }),

  quantity: Joi.number().integer().min(1).required().messages({
    "number.base": "Quantity must be a number.",
    "number.min": "Quantity must be at least 1.",
    "any.required": "Quantity is required.",
  }),

  unitPriceAtTransaction: Joi.number().precision(2).min(0).required().messages({
    "number.base": "Unit price must be a number.",
    "number.min": "Unit price cannot be negative.",
    "any.required": "Unit price is required.",
  }),

  subtotal: Joi.number().precision(2).min(0).optional().messages({
    "number.base": "Subtotal must be a number.",
    "number.min": "Subtotal cannot be negative.",
  }),
});

const transactionItemSchema = Joi.array().items(singleTransactionItemSchema);
export { transactionItemSchema, singleTransactionItemSchema };
