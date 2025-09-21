-- AlterTable
ALTER TABLE "public"."ProductVariant" ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[];
