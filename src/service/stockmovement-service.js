import { prisma } from "../application/database.js";

const getAllStockMovement = async ({ limit, offset }) => {
  return prisma.stockMovement.findMany({
    skip: offset,
    take: limit,
  });
};

const getStokMovementByProduct = async (productId) => {
  return prisma.stockMovement.findMany({
    where: {
      productId: productId,
    },
    orderBy: {
      id: "desc", // use a valid column name here
    },
  });
};

const getLowStockAlerts = async () => {
  return prisma.product.findMany({
    where: {
      currentStockQty: {
        lt: prisma.product.fields.minStockThreshold,
      },
    },
  });
};

export default {
  getAllStockMovement,
  getLowStockAlerts,
  getStokMovementByProduct,
};
