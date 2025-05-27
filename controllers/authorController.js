import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getAllAuthors = async (req, res) => {
    try {
        const authors = await prisma.author.findMany()
        res.json({ success: true, data: authors })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data author',
            error: error.message,
        })
    }
}

export const getAuthorById = async (req, res) => {
    const id = parseInt(req.params.id)
    try {
        const author = await prisma.author.findUnique({
            where: { id },
        })
        if (!author) {
            return res
                .status(404)
                .json({ success: false, message: 'Author tidak ditemukan' })
        }
        res.json({ success: true, data: author })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data author',
            error: error.message,
        })
    }
}

export const createAuthor = async (req, res) => {
    const { nama, bio } = req.body
    if (!nama) {
        return res
            .status(400)
            .json({ success: false, message: 'Nama author wajib diisi' })
    }

    try {
        const newAuthor = await prisma.author.create({
            data: { nama, bio },
        })
        res.status(201).json({
            success: true,
            data: newAuthor,
            message: 'Author berhasil dibuat',
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal membuat author',
            error: error.message,
        })
    }
}

export const updateAuthor = async (req, res) => {
    const id = parseInt(req.params.id)
    const { nama, bio } = req.body

    try {
        const existingAuthor = await prisma.author.findUnique({ where: { id } })
        if (!existingAuthor) {
            return res
                .status(404)
                .json({ success: false, message: 'Author tidak ditemukan' })
        }

        const updatedAuthor = await prisma.author.update({
            where: { id },
            data: { nama, bio },
        })
        res.json({
            success: true,
            data: updatedAuthor,
            message: 'Author berhasil diperbarui',
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal memperbarui author',
            error: error.message,
        })
    }
}

export const deleteAuthor = async (req, res) => {
    const id = parseInt(req.params.id)

    try {
        const existingAuthor = await prisma.author.findUnique({ where: { id } })
        if (!existingAuthor) {
            return res
                .status(404)
                .json({ success: false, message: 'Author tidak ditemukan' })
        }

        await prisma.author.delete({ where: { id } })
        res.json({ success: true, message: 'Author berhasil dihapus' })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus author',
            error: error.message,
        })
    }
}
