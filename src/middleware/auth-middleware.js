import jwt from "jsonwebtoken";
import { prisma } from "../application/database.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ errors: "Unauthorized" }).end();
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(401).json({ errors: "Unauthorized" }).end();
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ errors: "Invalid or expired token" }).end();
  }
};
