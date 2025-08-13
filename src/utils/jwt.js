import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "stokflow_secret";

export function generateToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return null;
  }
}
