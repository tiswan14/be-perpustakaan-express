import express from 'express'
import {
    getAllAuthors,
    getAuthorById,
    createAuthor,
    updateAuthor,
    deleteAuthor,
} from '../controllers/authorController.js'
import { authenticate } from '../middleware/authMiddleware.js'
import { authorizeRoles } from '../middleware/roleMiddleware.js'

const router = express.Router()

router.use(authenticate)

router.get('/author', getAllAuthors)
router.get('/author/:id', getAuthorById)

router.post('/author', authorizeRoles('admin'), createAuthor)
router.put('/author/:id', authorizeRoles('admin'), updateAuthor)
router.delete('/author/:id', authorizeRoles('admin'), deleteAuthor)

export default router
