import express from 'express'
import {
    getAllPeminjaman,
    getPeminjamanById,
    createPeminjaman,
    updatePeminjaman,
    deletePeminjaman,
} from '../controllers/peminjamanController.js'
import { authenticate } from '../middleware/authMiddleware.js'
import { authorizeRoles } from '../middleware/roleMiddleware.js'

const router = express.Router()

// Middleware otentikasi berlaku untuk semua rute
router.use(authenticate)

// Rute-rute publik atau admin
router.get('/peminjaman', getAllPeminjaman)
router.get('/peminjaman/detail/:id', getPeminjamanById)

// Hanya admin yang boleh buat, ubah, dan hapus peminjaman
router.post('/peminjaman/', authorizeRoles('admin'), createPeminjaman)
router.put('/peminjaman/edit/:id', authorizeRoles('admin'), updatePeminjaman)
router.delete(
    '/peminjaman/hapus/:id',
    authorizeRoles('admin'),
    deletePeminjaman
)

export default router
