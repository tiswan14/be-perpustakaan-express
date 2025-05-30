import { PrismaClient } from '../generated/prisma/index.js'

const prisma = new PrismaClient()

export const getAllBorrowings = async (req, res) => {
    try {
        const borrowings = await prisma.borrowing.findMany({
            include: {
                user: true,
                buku: true,
            },
        })
        res.json({ success: true, data: borrowings })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export const getBorrowingById = async (req, res) => {
    const { id } = req.params
    try {
        const borrowing = await prisma.borrowing.findUnique({
            where: { id: parseInt(id) },
            include: { user: true, buku: true },
        })
        if (!borrowing)
            return res
                .status(404)
                .json({ success: false, message: 'Peminjaman tidak ditemukan' })
        res.json({ success: true, data: borrowing })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export const createBorrowing = async (req, res) => {
    const { userId, bukuId, tanggalPinjam, tanggalKembali, status, denda } =
        req.body
    try {
        const newBorrowing = await prisma.borrowing.create({
            data: {
                userId,
                bukuId,
                tanggalPinjam: tanggalPinjam
                    ? new Date(tanggalPinjam)
                    : undefined,
                tanggalKembali: tanggalKembali
                    ? new Date(tanggalKembali)
                    : null,
                status: status || 'dipinjam',
                denda: denda || 0,
            },
        })
        res.status(201).json({ success: true, data: newBorrowing })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export const updateBorrowing = async (req, res) => {
    const { id } = req.params
    const { tanggalKembali, status, denda } = req.body
    try {
        const updated = await prisma.borrowing.update({
            where: { id: parseInt(id) },
            data: {
                tanggalKembali: tanggalKembali
                    ? new Date(tanggalKembali)
                    : undefined,
                status,
                denda,
            },
        })
        res.json({ success: true, data: updated })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export const deleteBorrowing = async (req, res) => {
    const { id } = req.params
    try {
        await prisma.borrowing.delete({ where: { id: parseInt(id) } })
        res.json({ success: true, message: 'Peminjaman berhasil dihapus' })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}
