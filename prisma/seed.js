import { PrismaClient } from '../generated/prisma/index.js'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    // --- Seed author ---
    const penulis1 = await prisma.author.create({
        data: {
            nama: 'Andrea Hirata',
            bio: 'Penulis novel terkenal dari Indonesia.',
        },
    })

    const penulis2 = await prisma.author.create({
        data: {
            nama: 'J.K. Rowling',
            bio: 'Penulis Harry Potter.',
        },
    })

    // --- Seed category ---
    const kategori1 = await prisma.category.create({
        data: {
            nama: 'Fiksi',
            deskripsi: 'Kategori buku fiksi.',
        },
    })

    const kategori2 = await prisma.category.create({
        data: {
            nama: 'Fantasi',
            deskripsi: 'Kategori buku fantasi.',
        },
    })

    // --- Seed book ---
    await prisma.book.createMany({
        data: [
            {
                judul: 'Laskar Pelangi',
                isbn: '9789791227209',
                deskripsi: 'Kisah anak-anak sekolah di Belitung.',
                tahunTerbit: 2005,
                penerbit: 'Bentang Pustaka',
                jumlahHalaman: 529,
                bahasa: 'Indonesia',
                sampul: 'https://example.com/sampul/laskar-pelangi.jpg',
                fileBuku: 'https://example.com/ebook/laskar-pelangi.pdf',
                tersedia: true,
                penulisId: penulis1.id,
                kategoriId: kategori1.id,
            },
            {
                judul: "Harry Potter and the Sorcerer's Stone",
                isbn: '9780439708180',
                deskripsi: 'Petualangan Harry Potter di Hogwarts.',
                tahunTerbit: 1997,
                penerbit: 'Bloomsbury',
                jumlahHalaman: 223,
                bahasa: 'Inggris',
                sampul: 'https://example.com/sampul/hp1.jpg',
                fileBuku: 'https://example.com/ebook/hp1.pdf',
                tersedia: true,
                penulisId: penulis2.id,
                kategoriId: kategori2.id,
            },
        ],
    })

    console.log('✅ Semua data berhasil diseed!')
}

main()
    .catch((e) => {
        console.error('❌ Gagal seeding:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
