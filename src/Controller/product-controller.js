import productService from "../service/product-service";

// Get All Product have Stored in Database

const getAllProducts = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts();

    res.status(200).json({
      message: "Get all products success",
      data: {
        products,
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
      data: detailProduct,
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
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await productService.deleteProductById(id);
    res.status(200).json({
      message: "Product deleted successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const request = req.body;
    const result = await productService.updateProductById(id, request);
    res.status(200).json({
      message: "Product deleted successfully",
      data: result,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      errors: err.message || "Failed to update product",
    });
    next(err);
  }
};

export default {
  deleteProduct,
  getAllProducts,
  getDetailProductById,
  updateProduct,
  createNewProduct,
};
