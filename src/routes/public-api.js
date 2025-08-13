import express from "express";
import userController from "../Controller/user-controller.js";
const publicRouter = new express.Router();
publicRouter.get("/", (req, res) => {
  res.json({
    message: "Welcome stokflow api",
  });
});

publicRouter.post("/api/users/login", userController.login);
export { publicRouter };
