import { prisma } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { createProductValidation } from "../validation/product-validation.js";
import { validate } from "../validation/validation.js";
import { v4 as uuidv4 } from "uuid";
function generateSKU() {
  return `PRD-${uuidv4().split("-")[0].toUpperCase()}`;
}

const getAllProducts = async ({ limit, offset }) => {
  const countProduct = await prisma.product.count({
    where: { isActive: true },
  });

  const products = await prisma.product.findMany({
    where: { isActive: true },
    skip: offset,
    take: limit,
  });

  return { products, total: countProduct };
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

  // generate SKU otomatis
  const sku = generateSKU();

  const createdProduct = await prisma.product.create({
    data: {
      ...product,
      sku,
    },
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

const softDeleteProductById = async (id) => {
  const numericId = Number(id);
  const existingProduct = await prisma.product.findUnique({
    where: {
      id: numericId,
    },
  });

  if (!existingProduct) {
    throw new ResponseError(404, "Product not found");
  }

  const softDeletedProduct = await prisma.product.update({
    where: {
      id: parseInt(id),
    },
    data: {
      isActive: false,
    },
  });

  return softDeletedProduct;
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

const getLowStockAlerts = async () => {
  return prisma.product.findMany({
    where: {
      currentStockQty: prisma.product.minStockThreshold,
    },
    select: {
      id: true,
      sku: true,
      productName: true,
      currentStockQty: true,
      minStockThreshold: true,
    },
  });
};

export const getAuditStock = async (page = 1, limit = 10) => {
  const pageNumber = Math.max(parseInt(page), 1);
  const limitNumber = Math.max(parseInt(limit), 1);
  const skip = (pageNumber - 1) * limitNumber;

  const totalItems = await prisma.product.count();
  const products = await prisma.product.findMany({
    skip,
    take: limitNumber,
    select: {
      id: true,
      sku: true,
      productName: true,
      currentStockQty: true,
      minStockThreshold: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  const data = products.map((p) => ({
    ...p,
    belowThreshold: p.currentStockQty < p.minStockThreshold,
    discrepancy: null,
    auditDate: new Date(),
  }));

  return {
    page: pageNumber,
    limit: limitNumber,
    totalItems,
    totalPages: Math.ceil(totalItems / limitNumber),
    data,
  };
};

export default {
  getAllProducts,
  updateProductById,
  getLowStockAlerts,
  getDetailProductById,
  getAuditStock,
  softDeleteProductById,
  PostNewProduct,
};
