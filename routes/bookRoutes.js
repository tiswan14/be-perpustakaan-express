import express from 'express'
import {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
} from '../controllers/bookController.js'

const router = express.Router()

router.get('/book', getAllBooks)
router.get('/book/:id', getBookById)
router.post('/book', createBook)
router.put('/book/:id', updateBook)
router.delete('/book/:id', deleteBook)

export default router
