import express from "express";
import productController from "../Controller/product-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";
import transctionController from "../Controller/transaction-controller.js";
import transactionItemController from "../Controller/transactionItem-controller.js";

const userRouter = express.Router();
userRouter.use(authMiddleware);
// product endpoint
userRouter.get("/api/products", productController.getAllProducts);
userRouter.get("/api/products/:id", productController.getDetailProductById);
userRouter.post("/api/products", productController.createNewProduct);
userRouter.delete("/api/products/:id", productController.deleteProduct);
userRouter.put("/api/products/:id", productController.updateProduct);

// transaction endpoint
userRouter.get("/api/transactions", transctionController.getAllTransactions);
userRouter.get("/api/transactions/:id", transctionController.detailTransactionById);
userRouter.post("/api/transactions/create", transctionController.createNewTransactions);
userRouter.patch("/api/transactions/:id", transctionController.patchTransactionById);
userRouter.delete("/api/transactions/:id", transctionController.deleteTransactions);

// transaction item endpoint
userRouter.get("/api/transactions/:id/items", transactionItemController.getItemTransactionByTransactionId);
userRouter.post("/api/transactions/:id/items", transactionItemController.postNewItemTransaction);
userRouter.patch("/api/transactions/:transactionId/items/:itemId", transactionItemController.updateTransactionItemController);
export { userRouter };
