import { PrismaClient } from '../generated/prisma/index.js'

const prisma = new PrismaClient()

export const getAllCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany()
        res.json({ success: true, data: categories })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data kategori',
            error: error.message,
        })
    }
}

export const getCategoryById = async (req, res) => {
    const id = parseInt(req.params.id)
    try {
        const category = await prisma.category.findUnique({ where: { id } })
        if (!category)
            return res
                .status(404)
                .json({ success: false, message: 'Kategori tidak ditemukan' })
        res.json({ success: true, data: category })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data kategori',
            error: error.message,
        })
    }
}

export const createCategory = async (req, res) => {
    const { nama, deskripsi } = req.body
    if (!nama)
        return res
            .status(400)
            .json({ success: false, message: 'Nama kategori wajib diisi' })

    try {
        const newCategory = await prisma.category.create({
            data: { nama, deskripsi },
        })
        res.status(201).json({
            success: true,
            data: newCategory,
            message: 'Kategori berhasil dibuat',
        })
    } catch (error) {
        if (error.code === 'P2002') {
            return res
                .status(400)
                .json({ success: false, message: 'Nama kategori sudah ada' })
        }
        res.status(500).json({
            success: false,
            message: 'Gagal membuat kategori',
            error: error.message,
        })
    }
}

export const updateCategory = async (req, res) => {
    const id = parseInt(req.params.id)
    const { nama, deskripsi } = req.body

    try {
        const existingCategory = await prisma.category.findUnique({
            where: { id },
        })
        if (!existingCategory)
            return res
                .status(404)
                .json({ success: false, message: 'Kategori tidak ditemukan' })

        const updatedCategory = await prisma.category.update({
            where: { id },
            data: { nama, deskripsi },
        })
        res.json({
            success: true,
            data: updatedCategory,
            message: 'Kategori berhasil diperbarui',
        })
    } catch (error) {
        if (error.code === 'P2002') {
            return res
                .status(400)
                .json({ success: false, message: 'Nama kategori sudah ada' })
        }
        res.status(500).json({
            success: false,
            message: 'Gagal memperbarui kategori',
            error: error.message,
        })
    }
}

export const deleteCategory = async (req, res) => {
    const id = parseInt(req.params.id)

    try {
        const existingCategory = await prisma.category.findUnique({
            where: { id },
        })
        if (!existingCategory)
            return res
                .status(404)
                .json({ success: false, message: 'Kategori tidak ditemukan' })

        await prisma.category.delete({ where: { id } })
        res.json({ success: true, message: 'Kategori berhasil dihapus' })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus kategori',
            error: error.message,
        })
    }
}
