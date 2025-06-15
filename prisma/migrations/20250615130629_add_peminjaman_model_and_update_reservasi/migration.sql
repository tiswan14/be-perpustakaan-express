/*
  Warnings:

  - You are about to drop the `reservasi` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "reservasi" DROP CONSTRAINT "reservasi_bookId_fkey";

-- DropForeignKey
ALTER TABLE "reservasi" DROP CONSTRAINT "reservasi_userId_fkey";

-- DropTable
DROP TABLE "reservasi";

-- CreateTable
CREATE TABLE "Reservasi" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "bookId" INTEGER NOT NULL,
    "tanggalAmbil" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "jamAmbil" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'reservasi',

    CONSTRAINT "Reservasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Peminjaman" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "bookId" INTEGER NOT NULL,
    "tanggalPinjam" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tanggalJatuhTempo" TIMESTAMP(3) NOT NULL,
    "tanggalKembali" TIMESTAMP(3),
    "status" TEXT DEFAULT 'dipinjam',
    "denda" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Peminjaman_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reservasi" ADD CONSTRAINT "Reservasi_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservasi" ADD CONSTRAINT "Reservasi_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Peminjaman" ADD CONSTRAINT "Peminjaman_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Peminjaman" ADD CONSTRAINT "Peminjaman_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
