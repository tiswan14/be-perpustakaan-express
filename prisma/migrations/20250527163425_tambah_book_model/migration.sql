-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Active';

-- CreateTable
CREATE TABLE "Book" (
    "id" SERIAL NOT NULL,
    "judul" TEXT NOT NULL,
    "isbn" TEXT NOT NULL,
    "deskripsi" TEXT,
    "tahunTerbit" INTEGER NOT NULL,
    "penerbit" TEXT,
    "jumlahHalaman" INTEGER,
    "bahasa" TEXT,
    "sampul" TEXT,
    "fileBuku" TEXT,
    "tersedia" BOOLEAN NOT NULL DEFAULT true,
    "penulisId" INTEGER NOT NULL,
    "kategoriId" INTEGER NOT NULL,
    "dibuatPada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbaruiPada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Author" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "bio" TEXT,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Book_isbn_key" ON "Book"("isbn");

-- CreateIndex
CREATE UNIQUE INDEX "Category_nama_key" ON "Category"("nama");

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_penulisId_fkey" FOREIGN KEY ("penulisId") REFERENCES "Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_kategoriId_fkey" FOREIGN KEY ("kategoriId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
