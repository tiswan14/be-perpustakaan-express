/*
  Warnings:

  - You are about to drop the column `bahasa` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `jumlahHalaman` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `penerbit` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `penulisId` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `sampul` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `tersedia` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `deskripsi` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `catatanAdmin` on the `reservasi` table. All the data in the column will be lost.
  - You are about to drop the column `jamAmbil` on the `reservasi` table. All the data in the column will be lost.
  - You are about to drop the column `tanggalAmbil` on the `reservasi` table. All the data in the column will be lost.
  - You are about to drop the `Author` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Book" DROP CONSTRAINT "Book_penulisId_fkey";

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "bahasa",
DROP COLUMN "jumlahHalaman",
DROP COLUMN "penerbit",
DROP COLUMN "penulisId",
DROP COLUMN "sampul",
DROP COLUMN "tersedia",
ADD COLUMN     "penulis" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'tersedia';

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "deskripsi";

-- AlterTable
ALTER TABLE "reservasi" DROP COLUMN "catatanAdmin",
DROP COLUMN "jamAmbil",
DROP COLUMN "tanggalAmbil";

-- DropTable
DROP TABLE "Author";
