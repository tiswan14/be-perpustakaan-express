import express from 'express'
import {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
} from '../controllers/categoryController.js'
import { authenticate } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(authenticate)

router.get('/category', getAllCategories)
router.get('/category/:id', getCategoryById)
router.post('/category', createCategory)
router.put('/category/:id', updateCategory)
router.delete('/category/:id', deleteCategory)

export default router
