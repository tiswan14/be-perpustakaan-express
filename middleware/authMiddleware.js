import jwt from 'jsonwebtoken'
import { PrismaClient } from '../generated/prisma/index.js'

const prisma = new PrismaClient()

export const authenticate = async (req, res, next) => {
    try {
        const token =
            req.cookies.token || req.headers.authorization?.split(' ')[1]
        if (!token) {
            return res
                .status(401)
                .json({ status: false, message: 'Token tidak ditemukan' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await prisma.user.findUnique({ where: { id: decoded.id } })

        if (!user) {
            return res
                .status(401)
                .json({ status: false, message: 'User tidak ditemukan' })
        }

        req.user = user
        next()
    } catch (err) {
        return res.status(401).json({
            status: false,
            message: 'Token tidak valid atau sudah kedaluwarsa',
        })
    }
}
