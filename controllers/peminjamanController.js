import { PrismaClient } from '../generated/prisma/index.js'

const prisma = new PrismaClient()

// Ambil semua data peminjaman
export const getAllPeminjaman = async (req, res) => {
    try {
        const peminjaman = await prisma.peminjaman.findMany({
            include: {
                reservasi: {
                    include: {
                        user: {
                            select: { id: true, nama: true },
                        },
                        book: {
                            select: { id: true, judul: true },
                        },
                    },
                },
            },
        })
        res.json({ success: true, data: peminjaman })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data peminjaman',
            error: error.message,
        })
    }
}

// Ambil satu data peminjaman berdasarkan ID
export const getPeminjamanById = async (req, res) => {
    const id = parseInt(req.params.id)
    try {
        const peminjaman = await prisma.peminjaman.findUnique({
            where: { id },
            include: {
                reservasi: true,
                User: true,
                Book: true,
            },
        })

        if (!peminjaman) {
            return res.status(404).json({
                success: false,
                message: 'Data peminjaman tidak ditemukan',
            })
        }

        res.json({ success: true, data: peminjaman })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data peminjaman',
            error: error.message,
        })
    }
}

// Buat data peminjaman baru
export const createPeminjaman = async (req, res) => {
    const { reservasiId, tanggalJatuhTempo, tanggalKembali, status, denda } =
        req.body

    try {
        // Validasi reservasi
        const reservasi = await prisma.reservasi.findUnique({
            where: { id: reservasiId },
        })

        if (!reservasi) {
            return res.status(404).json({
                success: false,
                message: 'Reservasi tidak ditemukan',
            })
        }

        const peminjaman = await prisma.peminjaman.create({
            data: {
                reservasiId,
                userId: reservasi.userId,
                bookId: reservasi.bookId,
                tanggalJatuhTempo: new Date(tanggalJatuhTempo),
                tanggalKembali: tanggalKembali
                    ? new Date(tanggalKembali)
                    : null,
                status: status || 'dipinjam',
                denda: denda || 0,
            },
        })

        res.status(201).json({
            success: true,
            data: peminjaman,
            message: 'Peminjaman berhasil dibuat',
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal membuat peminjaman',
            error: error.message,
        })
    }
}

// Update data peminjaman
export const updatePeminjaman = async (req, res) => {
    const id = parseInt(req.params.id)
    const { tanggalJatuhTempo, tanggalKembali, status, denda } = req.body

    try {
        const existing = await prisma.peminjaman.findUnique({ where: { id } })
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: 'Peminjaman tidak ditemukan',
            })
        }

        const updated = await prisma.peminjaman.update({
            where: { id },
            data: {
                tanggalJatuhTempo: tanggalJatuhTempo
                    ? new Date(tanggalJatuhTempo)
                    : undefined,
                tanggalKembali: tanggalKembali
                    ? new Date(tanggalKembali)
                    : undefined,
                status,
                denda,
            },
        })

        res.json({
            success: true,
            data: updated,
            message: 'Peminjaman berhasil diperbarui',
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal memperbarui peminjaman',
            error: error.message,
        })
    }
}

// Hapus data peminjaman
export const deletePeminjaman = async (req, res) => {
    const id = parseInt(req.params.id)

    try {
        const existing = await prisma.peminjaman.findUnique({ where: { id } })
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: 'Peminjaman tidak ditemukan',
            })
        }

        await prisma.peminjaman.delete({ where: { id } })
        res.json({ success: true, message: 'Peminjaman berhasil dihapus' })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus peminjaman',
            error: error.message,
        })
    }
}
