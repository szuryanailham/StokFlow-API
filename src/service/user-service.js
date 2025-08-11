import { prisma } from "../application/database.js";
import { loginValidated } from "../validation/user-validation.js";
import { validate } from "../validation/validation.js";
import { ResponseError } from "../error/response-error.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";

const login = async (request) => {
  const validateLoginInput = validate(loginValidated, request);

  const user = await prisma.user.findUnique({
    where: {
      email: validateLoginInput.email,
    },
    select: {
      email: true,
      password: true,
    },
  });

  if (!user) {
    throw new ResponseError(401, "Username or Password Wrong");
  }

  const isPasswordValid = await bcrypt.compare(validateLoginInput.password, user.password);

  if (!isPasswordValid) {
    throw new ResponseError(401, "Username or Password Wrong");
  }

  const token = generateToken({ id: user.id, email: user.email });

  return {
    message: "Login successful",
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  };
};

export default {
  login,
};
