import express from 'express'
import {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
} from '../controllers/categoryController.js'

const router = express.Router()

router.get('/category', getAllCategories)
router.get('/category/:id', getCategoryById)
router.post('/category', createCategory)
router.put('/category/:id', updateCategory)
router.delete('/category/:id', deleteCategory)

export default router
