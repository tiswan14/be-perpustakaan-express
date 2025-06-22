import express from 'express'

import {
    register,
    login,
    logout,
    getProfile,
    getAllUserByRole,
} from '../controllers/authController.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)
router.get('/profile', getProfile)
router.get('/get-users', getAllUserByRole)

export default router
