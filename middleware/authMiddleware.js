import jwt from 'jsonwebtoken'

export const authenticate = (req, res, next) => {
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
        req.userId = decoded.id

        next()
    } catch (error) {
        return res.status(401).json({
            status: false,
            message: 'Token tidak valid atau sudah kedaluwarsa',
        })
    }
}
