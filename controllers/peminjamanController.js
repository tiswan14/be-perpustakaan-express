import { PrismaClient } from '../generated/prisma/index.js'

const prisma = new PrismaClient()

// Ambil semua data peminjaman
export const getAllPeminjaman = async (req, res) => {
    try {
        const peminjaman = await prisma.peminjaman.findMany({
            where: {
                reservasi: {
                    status: 'Disetujui',
                },
            },
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

export const getPeminjamanByUserId = async (req, res) => {
    const userId = req.params.userId

    try {
        const peminjaman = await prisma.peminjaman.findMany({
            where: {
                userId: userId,
            },
            include: {
                User: {
                    select: {
                        id: true,
                        nama: true,
                    },
                },
                Book: {
                    select: {
                        id: true,
                        judul: true,
                    },
                },
                reservasi: {
                    include: {
                        book: {
                            select: {
                                id: true,
                                judul: true,
                            },
                        },
                        user: {
                            select: {
                                id: true,
                                nama: true,
                            },
                        },
                    },
                },
            },
        })

        if (peminjaman.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Tidak ada data peminjaman untuk user ini',
            })
        }

        res.json({
            success: true,
            data: peminjaman,
        })
    } catch (error) {
        console.error(
            '❌ Gagal mengambil data peminjaman berdasarkan userId:',
            error
        )
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data peminjaman',
            error: error.message,
        })
    }
}

export const kembalikanPeminjaman = async (req, res) => {
    const id = parseInt(req.params.id)

    try {
        const peminjaman = await prisma.peminjaman.findUnique({
            where: { id },
        })

        if (!peminjaman) {
            return res.status(404).json({
                success: false,
                message: 'Data peminjaman tidak ditemukan',
            })
        }

        // Ambil tanggal dari body (format: "2025-06-26")
        const inputTanggal = req.body.tanggalKembali
        if (!inputTanggal) {
            return res.status(400).json({
                success: false,
                message: 'tanggalKembali harus diisi dalam format YYYY-MM-DD',
            })
        }

        const tanggalKembali = new Date(`${inputTanggal}T00:00:00.000Z`)
        const jatuhTempo = new Date(peminjaman.tanggalJatuhTempo)

        // Hitung denda
        let denda = 0
        if (tanggalKembali > jatuhTempo) {
            const selisihHari = Math.ceil(
                (tanggalKembali - jatuhTempo) / (1000 * 60 * 60 * 24)
            )
            denda = selisihHari * 1000
        }

        const updated = await prisma.peminjaman.update({
            where: { id },
            data: {
                tanggalKembali,
                status: 'dikembalikan',
                denda,
            },
        })

        res.json({
            success: true,
            message: 'Peminjaman berhasil dikembalikan',
            data: updated,
        })
    } catch (error) {
        console.error('❌ Gagal mengembalikan peminjaman:', error)
        res.status(500).json({
            success: false,
            message: 'Gagal mengupdate data peminjaman',
            error: error.message,
        })
    }
}
