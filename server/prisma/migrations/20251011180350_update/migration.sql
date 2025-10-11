/*
  Warnings:

  - You are about to drop the column `codeExpiry` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `verificationCode` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."user" DROP COLUMN "codeExpiry",
DROP COLUMN "verificationCode",
ALTER COLUMN "isVerified" SET DEFAULT true;
