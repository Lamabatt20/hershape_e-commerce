/*
  Warnings:

  - You are about to drop the column `variantId` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the column `variantId` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the `ProductVariant` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."CartItem" DROP CONSTRAINT "CartItem_variantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."OrderItem" DROP CONSTRAINT "OrderItem_variantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductVariant" DROP CONSTRAINT "ProductVariant_productId_fkey";

-- AlterTable
ALTER TABLE "public"."CartItem" DROP COLUMN "variantId",
ADD COLUMN     "color" TEXT,
ADD COLUMN     "size" TEXT;

-- AlterTable
ALTER TABLE "public"."OrderItem" DROP COLUMN "variantId",
ADD COLUMN     "color" TEXT,
ADD COLUMN     "size" TEXT;

-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "available" TEXT,
ADD COLUMN     "colors" TEXT,
ADD COLUMN     "sizes" TEXT,
ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "public"."ProductVariant";
