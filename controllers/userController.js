import { PrismaClient } from '../generated/prisma/index.js'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export const getProfile = async (req, res) => {
    try {
        const token =
            req.cookies.token || req.headers.authorization?.split(' ')[1]
        if (!token) {
            return res.status(401).json({
                status: false,
                message: 'Tidak ada token, akses ditolak',
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const userId = decoded.id

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                nama: true,
                email: true,
                nim: true,
                nid: true,
            },
        })

        if (!user) {
            return res.status(404).json({
                status: false,
                message: 'Pengguna tidak ditemukan',
            })
        }

        const filteredUser = Object.fromEntries(
            Object.entries(user).filter(([_, v]) => v !== null)
        )

        res.json({
            status: true,
            message: 'Data profil berhasil diambil',
            user: filteredUser,
        })
    } catch (err) {
        console.error('Token verification error:', err.message)
        res.status(401).json({
            status: false,
            message: 'Token tidak valid atau sudah kedaluwarsa',
        })
    }
}

export const getAllUser = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            where: {
                role: {
                    in: ['mahasiswa', 'dosen'],
                },
            },
            orderBy: {
                nama: 'asc',
            },
            select: {
                id: true,
                nama: true,
                email: true,
                nim: true,
                nid: true,
                role: true,
                status: true,
            },
        })

        if (!users || users.length === 0) {
            return res.status(404).json({
                status: false,
                message:
                    'Tidak ada pengguna dengan peran mahasiswa atau dosen ditemukan',
            })
        }

        res.status(200).json({
            status: true,
            message: 'Data pengguna berhasil diambil',
            data: users,
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Gagal mengambil data pengguna',
            error: error.message,
        })
    }
}

export const deleteUser = async (req, res) => {
    const { id } = req.params

    if (!id) {
        return res.status(400).json({
            status: false,
            message: 'ID pengguna wajib disertakan',
        })
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { id },
        })

        if (!existingUser) {
            return res.status(404).json({
                status: false,
                message: 'Pengguna tidak ditemukan',
            })
        }

        await prisma.user.delete({
            where: { id },
        })

        return res.status(200).json({
            status: true,
            message: 'Pengguna berhasil dihapus',
        })
    } catch (error) {
        console.error('❌ Error saat menghapus pengguna:', error)
        return res.status(500).json({
            status: false,
            message: 'Kesalahan server saat menghapus pengguna',
        })
    }
}

export const editUser = async (req, res) => {
    const { id } = req.params
    const { nama, email, password, role, status, nim, nid } = req.body

    if (!id) {
        return res.status(400).json({
            status: false,
            message: 'ID pengguna wajib disertakan',
        })
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { id } })

        if (!existingUser) {
            return res.status(404).json({
                status: false,
                message: 'Pengguna tidak ditemukan',
            })
        }

        // Jika password tidak diberikan, gunakan password lama
        let hashedPassword = existingUser.password
        if (password && password.trim() !== '') {
            hashedPassword = await bcrypt.hash(password, 10)
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                nama,
                email,
                role,
                status,
                password: hashedPassword,
                nim: role === 'mahasiswa' ? nim : null,
                nid: role === 'dosen' ? nid : null,
            },
        })

        res.status(200).json({
            status: true,
            message: 'Pengguna berhasil diperbarui',
            data: updatedUser,
        })
    } catch (error) {
        console.error('Gagal mengedit user:', error)
        res.status(500).json({
            status: false,
            message: 'Terjadi kesalahan saat memperbarui data pengguna',
        })
    }
}

export const getTotalMahasiswaDanDosen = async (req, res) => {
    try {
        const total = await prisma.user.count({
            where: {
                role: {
                    in: ['mahasiswa', 'dosen'],
                },
            },
        })

        res.status(200).json({
            status: true,
            message: 'Total mahasiswa dan dosen berhasil dihitung',
            total,
        })
    } catch (error) {
        console.error('Gagal menghitung total:', error)
        res.status(500).json({
            status: false,
            message: 'Gagal menghitung total mahasiswa dan dosen',
            error: error.message,
        })
    }
}
