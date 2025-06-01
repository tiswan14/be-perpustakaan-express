import { PrismaClient } from '../generated/prisma/index.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const prisma = new PrismaClient()

export const register = async (req, res) => {
    const { nama, email, nim, nid, password } = req.body

    if (!nama?.trim()) {
        return res
            .status(400)
            .json({ status: false, message: 'Nama wajib diisi' })
    }

    if (!email?.trim()) {
        return res
            .status(400)
            .json({ status: false, message: 'Email wajib diisi' })
    }

    const domainPattern = /@sariwangi\.ac\.id$/
    if (!domainPattern.test(email.trim())) {
        return res
            .status(400)
            .json({
                status: false,
                message: 'Email harus menggunakan domain @sariwangi.ac.id',
            })
    }

    if (!password?.trim()) {
        return res
            .status(400)
            .json({ status: false, message: 'Kata sandi wajib diisi' })
    }

    if (password.trim().length < 6) {
        return res
            .status(400)
            .json({ status: false, message: 'Kata sandi minimal 6 karakter' })
    }

    if (!nim?.trim() && !nid?.trim()) {
        return res
            .status(400)
            .json({ status: false, message: 'NIM atau NID harus diisi' })
    }

    try {
        const existingEmail = await prisma.user.findUnique({
            where: { email: email.trim() },
        })

        if (existingEmail) {
            return res
                .status(409)
                .json({ status: false, message: 'Email sudah digunakan' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        // Tentukan role berdasarkan input nid
        let role = 'mahasiswa' // default role
        if (nid && nid.trim() !== '') {
            role = 'dosen'
        }

        const newUser = await prisma.user.create({
            data: {
                nama,
                email: email.trim(),
                nim: nim || null,
                nid: nid || null,
                password: hashedPassword,
                role, // simpan role ke database jika ada kolom role
            },
        })

        const responseUser = {
            id: newUser.id,
            nama: newUser.nama,
            email: newUser.email,
            role: newUser.role,
        }

        if (newUser.nim) responseUser.nim = newUser.nim
        if (newUser.nid) responseUser.nid = newUser.nid

        res.status(201).json({
            status: true,
            message: 'Pengguna berhasil didaftarkan',
            user: responseUser,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            status: false,
            error: 'Terjadi kesalahan server',
        })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body

    if (!email?.trim() || !password?.trim()) {
        return res.status(400).json({
            status: false,
            message: 'Email dan password wajib diisi',
        })
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user) {
            return res.status(401).json({
                status: false,
                message: 'Email atau password salah',
            })
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
            return res.status(401).json({
                status: false,
                message: 'Email atau password salah',
            })
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        })

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        const { password: _, ...userData } = user
        const filteredUser = Object.fromEntries(
            Object.entries(user).filter(([_, v]) => v !== null)
        )

        return res.status(200).json({
            status: true,
            message: 'Login berhasil',
            data: {
                user: filteredUser,
                token,
            },
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            status: false,
            message: 'Kesalahan server internal',
        })
    }
}

export const logout = (req, res) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({
                status: false,
                message: 'Tidak ada token, akses ditolak',
            })
        }

        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            path: '/',
        })

        return res.status(200).json({
            status: true,
            message: 'Logout berhasil',
        })
    } catch {
        return res.status(500).json({
            status: false,
            message: 'Kesalahan server internal',
        })
    }
}

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
    } catch {
        res.status(401).json({
            status: false,
            message: 'Token tidak valid atau sudah kedaluwarsa',
        })
    }
}
