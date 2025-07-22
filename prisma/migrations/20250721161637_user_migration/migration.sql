/*
  Warnings:

  - You are about to drop the `product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stockmovement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transactionitem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `userrole` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `stockmovement` DROP FOREIGN KEY `StockMovement_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `stockmovement` DROP FOREIGN KEY `StockMovement_transaction_item_id_fkey`;

-- DropForeignKey
ALTER TABLE `stockmovement` DROP FOREIGN KEY `StockMovement_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `transaction` DROP FOREIGN KEY `Transaction_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `transactionitem` DROP FOREIGN KEY `TransactionItem_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `transactionitem` DROP FOREIGN KEY `TransactionItem_transaction_id_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_role_id_fkey`;

-- DropIndex
DROP INDEX `User_role_id_fkey` ON `user`;

-- DropTable
DROP TABLE `product`;

-- DropTable
DROP TABLE `stockmovement`;

-- DropTable
DROP TABLE `transaction`;

-- DropTable
DROP TABLE `transactionitem`;

-- DropTable
DROP TABLE `userrole`;
