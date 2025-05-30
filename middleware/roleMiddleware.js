export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const user = req.user

        if (!user) {
            return res.status(401).json({
                status: false,
                message: 'User tidak ditemukan, akses ditolak',
            })
        }

        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({
                status: false,
                message:
                    'Akses ditolak: silakan hubungi admin jika ini adalah kesalahan.',
            })
        }

        next()
    }
}
