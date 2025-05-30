/*
  Warnings:

  - You are about to drop the `Borrowing` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Borrowing" DROP CONSTRAINT "Borrowing_bookId_fkey";

-- DropForeignKey
ALTER TABLE "Borrowing" DROP CONSTRAINT "Borrowing_userId_fkey";

-- DropTable
DROP TABLE "Borrowing";

-- CreateTable
CREATE TABLE "reservasi" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "bookId" INTEGER NOT NULL,
    "tanggalPinjam" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tanggalKembali" TIMESTAMP(3),
    "tanggalAmbil" TIMESTAMP(3),
    "jamAmbil" TEXT,
    "status" TEXT NOT NULL DEFAULT 'reservasi',
    "catatanAdmin" TEXT,
    "denda" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "reservasi_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reservasi" ADD CONSTRAINT "reservasi_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservasi" ADD CONSTRAINT "reservasi_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
