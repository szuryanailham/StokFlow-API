import { prisma } from "../application/database.js";
import userService from "../service/user-service.js";

const login = async (req, res, next) => {
  try {
    const result = await userService.login(req.body);
    res.status(200).json({ data: result });
  } catch (err) {
    next(err);
  }
};

// Controller untuk getMe
const getMe = async (req, res, next) => {
  try {
    const userId = req.user.id; // pastikan authMiddleware sudah set req.user
    const user = await userService.getUserWithRole(userId);
    res.status(200).json({
      message: "User data fetched successfully",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

export default {
  login,
  getMe,
};
