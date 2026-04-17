/*
  Warnings:

  - You are about to drop the column `berat` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `inStock` on the `ProductSize` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "berat",
ADD COLUMN     "weight" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ProductSize" DROP COLUMN "inStock";
