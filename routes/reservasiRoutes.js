import express from 'express'
import {
    getAllReservasi,
    getReservasiById,
    createReservasi,
    updateReservasi,
    deleteReservasi,
    updateReservasiStatus,
} from '../controllers/reservasiController.js'

const router = express.Router()

router.get('/reservasi', getAllReservasi)
router.get('/reservasi/detail/:id', getReservasiById)
router.post('/reservasi/tambah', createReservasi)
router.put('/reservasi/edit/:id', updateReservasi)
router.delete('/reservasi/hapus/:id', deleteReservasi)
router.patch('/reservasi/status/:id', updateReservasiStatus)

export default router
