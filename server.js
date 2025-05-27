import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import authRouter from './routes/authRoutes.js'
import authorRouter from './routes/authRoutes.js'
import categoryRouter from './routes/categoryRoutes.js'
import bookRouter from './routes/bookRoutes.js'
import borrowingRouter from './routes/borrowingRoutes.js'
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Backend Perpustakaan!' })
})

app.use('/api/auth', authRouter)
app.use('/api', authorRouter)
app.use('/api', categoryRouter)
app.use('/api', bookRouter)
app.use('/api', borrowingRouter)

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`)
})
