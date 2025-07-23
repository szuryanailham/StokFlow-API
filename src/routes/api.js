import express from "express";
import productController from "../Controller/product-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

const userRouter = express.Router();
userRouter.use(authMiddleware);
userRouter.get("/api/products", productController.getAllProducts);
export { userRouter };
