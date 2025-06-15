import jwt from 'jsonwebtoken'
import { PrismaClient } from '../generated/prisma/index.js'

const prisma = new PrismaClient()

export const authenticate = async (req, res, next) => {
    try {
        // Ambil token dari header Authorization atau cookie
        const authHeader = req.headers.authorization
        const token =
            req.cookies?.token ||
            (authHeader?.startsWith('Bearer ')
                ? authHeader.split(' ')[1]
                : null)

        if (!token) {
            return res.status(401).json({
                status: false,
                message: 'Akses ditolak: token tidak ditemukan',
            })
        }

        // Verifikasi token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // Cari user dari database
        const user = await prisma.user.findUnique({ where: { id: decoded.id } })

        if (!user) {
            return res.status(401).json({
                status: false,
                message: 'User tidak ditemukan',
            })
        }

        req.user = user
        next()
    } catch (err) {
        console.error('JWT Error:', err.message)
        return res.status(401).json({
            status: false,
            message: 'Token tidak valid atau sudah kedaluwarsa',
        })
    }
}
