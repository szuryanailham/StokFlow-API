import express from "express";
import productController from "../Controller/product-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

const userRouter = express.Router();
userRouter.use(authMiddleware);
userRouter.get("/api/products", productController.getAllProducts);
userRouter.get("/api/products/:id", productController.getDetailProductById);
userRouter.post("/api/products", productController.createNewProduct);
userRouter.delete("/api/products/:id", productController.deleteProduct);
userRouter.put("/api/products/:id", productController.updateProduct);
export { userRouter };
