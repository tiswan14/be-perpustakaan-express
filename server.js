// server.js
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { PrismaClient } from './generated/prisma/index.js'

dotenv.config()

const app = express()
const prisma = new PrismaClient()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Backend Perpustakaan!' })
})

app.get('/buku', async (req, res) => {
    res.json('Data Buku')
})

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`)
})
