import { ResponseError } from "../error/response-error.js";

const validate = (schema, request) => {
  const { error, value } = schema.validate(request, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true,
  });

  if (error) {
    throw new ResponseError(400, error.details.map((e) => e.message).join(", "));
  }

  return value;
};

export { validate };
