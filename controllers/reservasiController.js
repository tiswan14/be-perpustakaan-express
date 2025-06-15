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

    if (!userId || !bookId)
        return res.status(400).json({
            success: false,
            message: 'userId dan bookId wajib diisi',
        })

    try {
        const newReservasi = await prisma.reservasi.create({
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
                status: status || 'reservasi',
                catatanAdmin,
                denda: denda || 0,
            },
        })
        res.status(201).json({
            success: true,
            data: newReservasi,
            message: 'Reservasi berhasil dibuat',
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal membuat reservasi',
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
