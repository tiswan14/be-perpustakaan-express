import { PrismaClient } from '../generated/prisma/index.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const prisma = new PrismaClient()

export const register = async (req, res) => {
    const { nama, email, nim, nid, password } = req.body

    if (!nama?.trim() || !email?.trim() || !password?.trim()) {
        return res
            .status(400)
            .json({ message: 'Name, email, and password are required' })
    }

    if (!nim && !nid) {
        return res.status(400).json({ message: 'NIM or NID must be provided' })
    }

    try {
        const existingEmail = await prisma.user.findUnique({
            where: { email },
        })

        if (existingEmail) {
            return res.status(409).json({ message: 'Email already used' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await prisma.user.create({
            data: {
                nama,
                email,
                nim: nim || null,
                nid: nid || null,
                password: hashedPassword,
            },
        })

        res.status(201).json({
            message: 'User registered',
            user: {
                id: newUser.id,
                nama: newUser.nama,
                email: newUser.email,
                nim: newUser.nim,
                nid: newUser.nid,
            },
        })
    } catch {
        res.status(500).json({ error: 'Server error' })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body

    if (!email?.trim() || !password?.trim()) {
        return res
            .status(400)
            .json({ message: 'Email and password are required' })
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
            return res
                .status(401)
                .json({ message: 'Email or password is incorrect' })
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

        return res.status(200).json({
            message: 'Login successfully',
            data: {
                user: userData,
                token,
            },
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const logout = (req, res) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res
                .status(401)
                .json({ message: 'Unauthorized: No token provided' })
        }

        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            path: '/',
        })

        return res.status(200).json({ message: 'Logout successful' })
    } catch {
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const getProfile = async (req, res) => {
    try {
        const token =
            req.cookies.token || req.headers.authorization?.split(' ')[1]
        if (!token) {
            return res
                .status(401)
                .json({ message: 'Unauthorized: No token provided' })
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
            return res.status(404).json({ message: 'User not found' })
        }

        res.json({
            message: 'Profile data fetched successfully',
            user,
        })
    } catch {
        res.status(401).json({ message: 'Invalid or expired token' })
    }
}
