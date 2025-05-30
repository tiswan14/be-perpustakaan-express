import express from 'express'
import {
    getAllReservasi,
    getReservasiById,
    createReservasi,
    updateReservasi,
    deleteReservasi,
} from '../controllers/reservasiController.js'

const router = express.Router()

router.get('/reservasi', getAllReservasi)
router.get('/reservasi/:id', getReservasiById)
router.post('/reservasi', createReservasi)
router.put('/reservasi/:id', updateReservasi)
router.delete('/reservasi/:id', deleteReservasi)

export default router
