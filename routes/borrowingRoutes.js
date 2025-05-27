import express from 'express'
import {
    getAllBorrowings,
    getBorrowingById,
    createBorrowing,
    updateBorrowing,
    deleteBorrowing,
} from '../controllers/borrowingController.js'

const router = express.Router()

router.get('/borrowing', getAllBorrowings)
router.get('/borrowing/:id', getBorrowingById)
router.post('/borrowing', createBorrowing)
router.put('/borrowing/:id', updateBorrowing)
router.delete('/borrowing/:id', deleteBorrowing)

export default router
