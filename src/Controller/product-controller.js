import productService from "../service/product-service";

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

export default {
  getAllProducts,
};
