import express from 'express'
import {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
} from '../controllers/categoryController.js'
import { authenticate } from '../middleware/authMiddleware.js'
import { authorizeRoles } from '../middleware/roleMiddleware.js'

const router = express.Router()

router.use(authenticate)

router.get('/category', getAllCategories)
router.get('/category/:id', getCategoryById)

router.post('/category', authorizeRoles('admin'), createCategory)
router.put('/category/:id', authorizeRoles('admin'), updateCategory)
router.delete('/category/:id', authorizeRoles('admin'), deleteCategory)

export default router
