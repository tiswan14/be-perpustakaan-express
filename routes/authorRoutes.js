import express from 'express'
import {
    getAllAuthors,
    getAuthorById,
    createAuthor,
    updateAuthor,
    deleteAuthor,
} from '../controllers/authorController.js'

const router = express.Router()

router.get('/author', getAllAuthors)
router.get('/author/:id', getAuthorById)
router.post('/author', createAuthor)
router.put('/author/:id', updateAuthor)
router.delete('/author/:id', deleteAuthor)


export default router
