/*
  Warnings:

  - You are about to drop the column `nik` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "nik",
ADD COLUMN     "nid" TEXT;
