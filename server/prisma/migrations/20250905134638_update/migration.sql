-- AlterTable
ALTER TABLE "public"."Customer" ADD COLUMN     "city" TEXT NOT NULL DEFAULT 'unknown',
ADD COLUMN     "country_region" TEXT NOT NULL DEFAULT 'unknown',
ADD COLUMN     "postal_code" TEXT NOT NULL DEFAULT '0000';
