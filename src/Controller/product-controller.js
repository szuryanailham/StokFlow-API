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

export default {
  getAllProducts,
  getDetailProductById,
  createNewProduct,
};
