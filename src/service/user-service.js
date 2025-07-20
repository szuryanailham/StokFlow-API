import { PrismaClient } from "@prisma/client/extension";
import { loginValidated } from "../validation/user-validation";
import { validate } from "../validation/validation";
const login = async (request) => {
  // Create a variable to match the validation result with the incoming request
  const validateLoginInput = validate(loginValidated, request);
  // If the validation passes, query the database using Prisma to find the user based on the request
  const user = await PrismaClient.user.findUnique({
    where: {
      username: validateLoginInput.username,
    },
    select: {
      username: true,
      password: true,
    },
  });

  // If the user is not found, return an error using a function that provides a description and status code
  if (!user) {
  }
  // If the user is found, generate a token using UUID
  // Update the user's login data in the database using Prisma and return the result
};
