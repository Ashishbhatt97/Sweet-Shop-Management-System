/*
  Warnings:

  - You are about to drop the column `description` on the `sweets` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `sweets` table. All the data in the column will be lost.
  - You are about to drop the `purchases` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "purchases" DROP CONSTRAINT "purchases_sweetId_fkey";

-- DropForeignKey
ALTER TABLE "purchases" DROP CONSTRAINT "purchases_userId_fkey";

-- AlterTable
ALTER TABLE "sweets" DROP COLUMN "description",
DROP COLUMN "imageUrl";

-- DropTable
DROP TABLE "purchases";
