import { prisma } from "../application/database.js";
const getAllProducts = async () => {
  const products = await prisma.product.findMany();
  return products;
};

export default {
  getAllProducts,
};
