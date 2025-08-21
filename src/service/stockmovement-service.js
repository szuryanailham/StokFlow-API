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

export const createStockMovements = async ({ transactionItem, productId, quantity, userId, transacationId }) => {
  // TODO: hitung stockAfterMovement terakhir jika perlu
  const stockAfterMovement = 0;

  return await prisma.stockMovement.create({
    data: {
      productId,
      movementType: "OUT", // default untuk transaksi penjualan
      quantityChanged: quantity,
      stockAfterMovement,
      reason: `Transaction #${transactionItem.transactionId}`, // pakai transactionItem untuk referensi
      transactionItemId: transactionItem.id,
      userId,
    },
  });
};

export default {
  getAllStockMovement,
  getLowStockAlerts,
  getStokMovementByProduct,
  createStockMovements,
};
