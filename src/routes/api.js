import express from "express";
import productController from "../Controller/product-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";
import transctionController from "../Controller/transaction-controller.js";
import transactionItemController from "../Controller/transactionItem-controller.js";
import stockmovementController from "../Controller/stockmovement-controller.js";
import userController from "../Controller/user-controller.js";

const userRouter = express.Router();
userRouter.use(authMiddleware);

userRouter.get("/auth/me", userController.getMe);
// product endpoint
userRouter.get("/api/products", productController.getAllProducts);
userRouter.get("/api/products/:id", productController.getDetailProductById);
userRouter.post("/api/products", productController.createNewProduct);
userRouter.patch("/api/products/:id/soft-delete", productController.softDeleteProductController);
userRouter.put("/api/products/:id", productController.updateProduct);
userRouter.get("/api/audit-stock", productController.auditStockHandler);

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
userRouter.delete("/api/transactions/:transactionId/items/:itemId", transactionItemController.deleteTransactionItemController);

// StokMovement endpoint
userRouter.get("/api/stock-movements", stockmovementController.getAllStockMovement);
userRouter.get("/api/products/:id/history", stockmovementController.getStockMovementByProduct);
userRouter.get("/api/stock-movements/low-stock-alerts", stockmovementController.getLowStockAlertsController);

export { userRouter };
