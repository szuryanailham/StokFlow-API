import { ResponseError } from "../error/response-error.js";
import productService from "../service/product-service.js";

const getAllProducts = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const offset = (page - 1) * limit;

    const { products, total } = await productService.getAllProducts({
      page,
      limit,
      offset,
    });

    res.status(200).json({
      success: true,
      products,
      total,
      pagination: {
        page,
        limit,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Get Detail Product By ID
const getDetailProductById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const detailProduct = await productService.getDetailProductById(id);
    res.status(200).json({
      message: "Get product detail success",
      data: {
        product: detailProduct,
      },
    });
  } catch (err) {
    next(err);
  }
};

// POST : Create New Product
const createNewProduct = async (req, res, next) => {
  try {
    const request = req.body;
    const result = await productService.PostNewProduct(request);

    res.status(201).json({
      message: "Product created successfully",
      data: {
        product: result,
      },
    });
  } catch (err) {
    next(err);
  }
};

// SOFT DELETE Product

const softDeleteProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await productService.softDeleteProductById(id);

    res.status(200).json({
      message: "Product deleted successfully (soft delete)",
      data: deletedProduct,
    });
  } catch (err) {
    if (err instanceof ResponseError) {
      return res.status(err.status).json({ errors: err.message });
    }
    console.error("Unexpected error:", err);
    res.status(500).json({ errors: "Internal server error" });
  }
};

// PUT : Update Product
const updateProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const request = req.body;
    const result = await productService.updateProductById(id, request);
    res.status(200).json({
      message: "Product updated successfully",
      data: {
        product: result,
      },
    });
  } catch (err) {
    res.status(err.status || 500).json({
      message: "Failed to update product",
      errors: err.message,
    });
    next(err);
  }
};

export const auditStockHandler = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const auditData = await productService.getAuditStock(pageNumber, limitNumber);

    res.status(200).json({
      status: "success",
      ...auditData,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  softDeleteProductController,
  getAllProducts,
  getDetailProductById,
  auditStockHandler,
  updateProduct,
  createNewProduct,
};
