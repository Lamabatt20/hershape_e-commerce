/*
  Warnings:

  - You are about to drop the column `image` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "image";

-- AlterTable
ALTER TABLE "public"."ProductVariant" ADD COLUMN     "images" TEXT[];
