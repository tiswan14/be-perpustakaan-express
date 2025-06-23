import express from 'express'
import {
    getProfile,
    getAllUser,
    deleteUser,
} from '../controllers/userController.js'

import { authenticate } from '../middleware/authMiddleware.js'
import { authorizeRoles } from '../middleware/roleMiddleware.js'

const router = express.Router()

router.use(authenticate)

router.get('/user/profile', getProfile)

router.get('/user', authorizeRoles('admin'), getAllUser)

router.delete('/user/hapus/:id', authorizeRoles('admin'), deleteUser)

export default router
