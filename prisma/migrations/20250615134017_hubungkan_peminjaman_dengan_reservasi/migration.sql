/*
  Warnings:

  - A unique constraint covering the columns `[reservasiId]` on the table `Peminjaman` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `reservasiId` to the `Peminjaman` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Peminjaman" DROP CONSTRAINT "Peminjaman_bookId_fkey";

-- DropForeignKey
ALTER TABLE "Peminjaman" DROP CONSTRAINT "Peminjaman_userId_fkey";

-- AlterTable
ALTER TABLE "Peminjaman" ADD COLUMN     "reservasiId" INTEGER NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "bookId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Peminjaman_reservasiId_key" ON "Peminjaman"("reservasiId");

-- AddForeignKey
ALTER TABLE "Peminjaman" ADD CONSTRAINT "Peminjaman_reservasiId_fkey" FOREIGN KEY ("reservasiId") REFERENCES "Reservasi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Peminjaman" ADD CONSTRAINT "Peminjaman_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Peminjaman" ADD CONSTRAINT "Peminjaman_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE SET NULL ON UPDATE CASCADE;
