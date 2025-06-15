import express from 'express'
import {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    totalBook,
} from '../controllers/bookController.js'

const router = express.Router()

router.get('/book/', getAllBooks)
router.get('/book/detail/:id', getBookById)
router.post('/book/tambah', createBook)
router.put('/book/edit/:id', updateBook)
router.delete('/book/hapus/:id', deleteBook)
router.get('/book/total', totalBook)


export default router
