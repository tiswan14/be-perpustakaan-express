import { PrismaClient } from '../generated/prisma/index.js'

const prisma = new PrismaClient()

export const getAllReservasi = async (req, res) => {
    try {
        const reservasi = await prisma.reservasi.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        nama: true,
                    },
                },
                book: {
                    select: {
                        id: true,
                        judul: true,
                    },
                },
            },
        })
        res.json({ success: true, data: reservasi })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data reservasi',
            error: error.message,
        })
    }
}

export const getReservasiById = async (req, res) => {
    const id = parseInt(req.params.id)
    try {
        const reservasi = await prisma.reservasi.findUnique({
            where: { id },
            include: {
                user: true,
                book: true,
            },
        })
        if (!reservasi)
            return res
                .status(404)
                .json({ success: false, message: 'Reservasi tidak ditemukan' })
        res.json({ success: true, data: reservasi })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data reservasi',
            error: error.message,
        })
    }
}

export const createReservasi = async (req, res) => {
    const { userId, bookId, tanggalAmbil, jamAmbil, catatan, status } = req.body

    if (!userId || !bookId) {
        return res.status(400).json({
            success: false,
            message: 'userId dan bookId wajib diisi',
        })
    }

    try {
        const newReservasi = await prisma.reservasi.create({
            data: {
                userId,
                bookId,
                tanggalAmbil: tanggalAmbil ? new Date(tanggalAmbil) : undefined,
                jamAmbil,
                catatan,
                status: status || 'Tunggu',
            },
        })

        res.status(201).json({
            success: true,
            message: 'Reservasi berhasil dibuat',
            data: newReservasi,
        })
    } catch (error) {
        console.error('❌ Gagal membuat reservasi:', error)
        res.status(500).json({
            success: false,
            message: 'Gagal membuat reservasi',
            error: error.message,
        })
    }
}

export const updateReservasiStatus = async (req, res) => {
    const id = parseInt(req.params.id)
    const { status } = req.body

    try {
        const existingReservasi = await prisma.reservasi.findUnique({
            where: { id },
            include: {
                peminjaman: true,
                book: true,
            },
        })

        if (!existingReservasi) {
            return res.status(404).json({
                success: false,
                message: 'Reservasi tidak ditemukan',
            })
        }

        const statusSebelumnya = existingReservasi.status
        let newPeminjaman = null
        let updatedBook = null

        const result = await prisma.$transaction(async (prisma) => {
            if (status === 'Disetujui' && statusSebelumnya !== 'Disetujui') {
                if (existingReservasi.book.stok <= 0) {
                    throw new Error(
                        'Stok buku habis, tidak bisa menyetujui reservasi'
                    )
                }

                if (existingReservasi.peminjaman) {
                    throw new Error('Reservasi ini sudah memiliki peminjaman')
                }

                const tanggalPinjam = new Date()
                const tanggalJatuhTempo = new Date()
                tanggalJatuhTempo.setDate(tanggalPinjam.getDate() + 7)

                newPeminjaman = await prisma.peminjaman.create({
                    data: {
                        reservasiId: id,
                        userId: existingReservasi.userId,
                        bookId: existingReservasi.bookId,
                        tanggalPinjam,
                        tanggalJatuhTempo,
                    },
                })

                updatedBook = await prisma.book.update({
                    where: { id: existingReservasi.bookId },
                    data: {
                        stok: {
                            decrement: 1,
                        },
                    },
                })
            } else if (
                status === 'Ditolak' &&
                statusSebelumnya === 'Disetujui'
            ) {
                if (existingReservasi.peminjaman) {
                    await prisma.peminjaman.delete({
                        where: { reservasiId: id },
                    })

                    updatedBook = await prisma.book.update({
                        where: { id: existingReservasi.bookId },
                        data: {
                            stok: {
                                increment: 1,
                            },
                        },
                    })
                }
            }

            const updatedReservasi = await prisma.reservasi.update({
                where: { id },
                data: { status },
            })

            return { updatedReservasi, newPeminjaman, updatedBook }
        })

        return res.json({
            success: true,
            message: '✅ Status reservasi berhasil diperbarui',
            data: {
                reservasi: result.updatedReservasi,
                peminjamanBaru: result.newPeminjaman,
                bukuTerbaru: result.updatedBook,
            },
        })
    } catch (error) {
        console.error('❌ Gagal memperbarui status:', error)
        res.status(500).json({
            success: false,
            message: error.message || 'Gagal memperbarui status reservasi',
            error: error.message,
        })
    }
}

export const updateReservasi = async (req, res) => {
    const id = parseInt(req.params.id)
    const {
        userId,
        bookId,
        tanggalPinjam,
        tanggalKembali,
        tanggalAmbil,
        jamAmbil,
        status,
        catatanAdmin,
        denda,
    } = req.body

    try {
        const existingReservasi = await prisma.reservasi.findUnique({
            where: { id },
        })
        if (!existingReservasi)
            return res.status(404).json({
                success: false,
                message: 'Reservasi tidak ditemukan',
            })

        const updatedReservasi = await prisma.reservasi.update({
            where: { id },
            data: {
                userId,
                bookId,
                tanggalPinjam: tanggalPinjam
                    ? new Date(tanggalPinjam)
                    : undefined,
                tanggalKembali: tanggalKembali
                    ? new Date(tanggalKembali)
                    : undefined,
                tanggalAmbil: tanggalAmbil ? new Date(tanggalAmbil) : undefined,
                jamAmbil,
                status,
                catatanAdmin,
                denda,
            },
        })
        res.json({
            success: true,
            data: updatedReservasi,
            message: 'Reservasi berhasil diperbarui',
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal memperbarui reservasi',
            error: error.message,
        })
    }
}

export const deleteReservasi = async (req, res) => {
    const id = parseInt(req.params.id)

    try {
        const existingReservasi = await prisma.reservasi.findUnique({
            where: { id },
        })
        if (!existingReservasi)
            return res.status(404).json({
                success: false,
                message: 'Reservasi tidak ditemukan',
            })

        await prisma.reservasi.delete({ where: { id } })
        res.json({ success: true, message: 'Reservasi berhasil dihapus' })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus reservasi',
            error: error.message,
        })
    }
}

export const getReservasiByUserId = async (req, res) => {
    const userId = req.params.userId

    try {
        const reservasi = await prisma.reservasi.findMany({
            where: {
                userId: userId,
            },
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
        })

        if (reservasi.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Tidak ada reservasi untuk user ini',
            })
        }

        res.json({
            success: true,
            data: reservasi,
        })
    } catch (error) {
        console.error(
            '❌ Gagal mengambil data reservasi berdasarkan userId:',
            error
        )
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data reservasi',
            error: error.message,
        })
    }
}
