import { prisma } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { createProductValidation } from "../validation/product-validation.js";
import { validate } from "../validation/validation.js";
const getAllProducts = async () => {
  const products = await prisma.product.findMany();
  return products;
};

const getDetailProductById = async (id) => {
  const detailProduct = await prisma.product.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  if (!detailProduct) {
    throw new ResponseError(404, "Product not found");
  }

  return detailProduct;
};

const PostNewProduct = async (request) => {
  const product = validate(createProductValidation, request);
  const existingProduct = await prisma.product.findUnique({
    where: { sku: product.sku },
  });
  if (existingProduct) {
    throw new ResponseError(409, "Product with this SKU already exists");
  }

  const createdProduct = await prisma.product.create({
    data: product,
    select: {
      id: true,
      sku: true,
      productName: true,
      description: true,
      purchasePrice: true,
      sellingPrice: true,
      currentStockQty: true,
      minStockThreshold: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return createdProduct;
};

const deleteProductById = async (id) => {
  const existingProduct = await prisma.product.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!existingProduct) {
    throw new ResponseError(404, "Product not found");
  }

  const deletedProduct = await prisma.product.delete({
    where: {
      id: parseInt(id),
    },
  });

  return deletedProduct;
};

const updateProductById = async (id, request) => {
  const numericId = Number(id);
  const product = validate(createProductValidation, request);
  const existingProduct = await prisma.product.findUnique({
    where: { id: numericId },
  });

  if (!existingProduct) {
    throw new ResponseError(404, "Product not found");
  }

  const updatedProduct = await prisma.product.update({
    where: { id: numericId },
    data: product,
    select: {
      sku: true,
      productName: true,
      description: true,
      purchasePrice: true,
      sellingPrice: true,
      currentStockQty: true,
      minStockThreshold: true,
      updatedAt: true,
    },
  });
  return updatedProduct;
};

export default {
  getAllProducts,
  updateProductById,
  getDetailProductById,
  deleteProductById,
  PostNewProduct,
};
