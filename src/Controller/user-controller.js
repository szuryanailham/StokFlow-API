import userService from "../service/user-service.js";

const login = async (req, res, next) => {
  try {
    const result = await userService.login(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export default {
  login,
};
