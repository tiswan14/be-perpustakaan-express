import multer from 'multer'
import { PrismaClient } from '../generated/prisma/index.js'
import { uploadToVercelBlob } from '../utils/vercelBlob.js'
import { getFileExtension } from '../utils/fileHelper.js'

const prisma = new PrismaClient()
const upload = multer()

export const createBook = [
    upload.single('image'),
    async (req, res) => {
        try {
            const {
                judul,
                isbn,
                deskripsi,
                tahunTerbit,
                penerbit,
                jumlahHalaman,
                bahasa,
                sampul,
                tersedia,
                stok,
                penulisId,
                kategoriId,
            } = req.body

            if (!judul || !isbn || !tahunTerbit || !penulisId || !kategoriId) {
                return res.status(400).json({
                    success: false,
                    message:
                        'Field wajib: judul, isbn, tahunTerbit, penulisId, kategoriId',
                })
            }

            let imageUrl = null

            if (req.file) {
                try {
                    const namaBersih = judul.toLowerCase().replace(/\s+/g, '-') 
                    const ekstensi = getFileExtension(req.file.originalname)
                    const namaFileUpload = `cover-buku-universitas-sariwangi-${namaBersih}${ekstensi}`

                    imageUrl = await uploadToVercelBlob(
                        req.file.buffer,
                        namaFileUpload,
                        req.file.mimetype
                    )
                } catch (uploadError) {
                    return res.status(500).json({
                        success: false,
                        message: 'Gagal upload image',
                        error: uploadError.message,
                    })
                }
            }

            const newBook = await prisma.book.create({
                data: {
                    judul,
                    isbn,
                    deskripsi,
                    tahunTerbit: parseInt(tahunTerbit),
                    penerbit,
                    jumlahHalaman: jumlahHalaman
                        ? parseInt(jumlahHalaman)
                        : null,
                    bahasa,
                    sampul,
                    tersedia:
                        tersedia !== undefined
                            ? tersedia === 'true' || tersedia === true
                            : true,
                    stok: stok !== undefined ? parseInt(stok) : 1,
                    penulisId: parseInt(penulisId),
                    kategoriId: parseInt(kategoriId),
                    image: imageUrl,
                },
            })

            res.status(201).json({
                success: true,
                data: newBook,
                message: 'Buku berhasil dibuat',
            })
        } catch (error) {
            if (error.code === 'P2002') {
                return res.status(400).json({
                    success: false,
                    message: 'ISBN sudah digunakan',
                })
            }
            res.status(500).json({
                success: false,
                message: 'Gagal membuat buku',
                error: error.message,
            })
        }
    },
]

export const getAllBooks = async (req, res) => {
    try {
        const books = await prisma.book.findMany({
            include: {
                penulis: true,
                kategori: true,
            },
        })
        res.json({ success: true, data: books })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data buku',
            error: error.message,
        })
    }
}

export const getBookById = async (req, res) => {
    const id = parseInt(req.params.id)
    try {
        const book = await prisma.book.findUnique({
            where: { id },
            include: {
                penulis: true,
                kategori: true,
            },
        })
        if (!book)
            return res
                .status(404)
                .json({ success: false, message: 'Buku tidak ditemukan' })
        res.json({ success: true, data: book })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data buku',
            error: error.message,
        })
    }
}

export const updateBook = async (req, res) => {
    const id = parseInt(req.params.id)
    const {
        judul,
        isbn,
        deskripsi,
        tahunTerbit,
        penerbit,
        jumlahHalaman,
        bahasa,
        sampul,
        tersedia,
        stok,
        penulisId,
        kategoriId,
    } = req.body

    try {
        const existingBook = await prisma.book.findUnique({ where: { id } })
        if (!existingBook)
            return res
                .status(404)
                .json({ success: false, message: 'Buku tidak ditemukan' })

        const updatedBook = await prisma.book.update({
            where: { id },
            data: {
                judul,
                isbn,
                deskripsi,
                tahunTerbit,
                penerbit,
                jumlahHalaman,
                bahasa,
                sampul,
                tersedia,
                stok,
                penulisId,
                kategoriId,
            },
        })
        res.json({
            success: true,
            data: updatedBook,
            message: 'Buku berhasil diperbarui',
        })
    } catch (error) {
        if (error.code === 'P2002') {
            return res
                .status(400)
                .json({ success: false, message: 'ISBN sudah digunakan' })
        }
        res.status(500).json({
            success: false,
            message: 'Gagal memperbarui buku',
            error: error.message,
        })
    }
}

export const deleteBook = async (req, res) => {
    const id = parseInt(req.params.id)

    try {
        const existingBook = await prisma.book.findUnique({ where: { id } })
        if (!existingBook)
            return res
                .status(404)
                .json({ success: false, message: 'Buku tidak ditemukan' })

        await prisma.book.delete({ where: { id } })
        res.json({ success: true, message: 'Buku berhasil dihapus' })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus buku',
            error: error.message,
        })
    }
}
