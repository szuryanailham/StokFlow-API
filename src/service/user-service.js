import { prisma } from "../application/database.js";
import { loginValidated } from "../validation/user-validation.js";
import { validate } from "../validation/validation.js";
import { ResponseError } from "../error/response-error.js";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";

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

  const token = uuid().toString();

  const updatedUser = await prisma.user.update({
    data: {
      token: token,
    },
    where: {
      email: user.email,
    },
    select: {
      token: true,
    },
  });

  return updatedUser;
};

export default {
  login,
};
