import Joi from "joi";

const loginValidated = Joi.object({
  email: Joi.string().email().max(100).required(),
  password: Joi.string().max(100).required(),
});

export { loginValidated };
