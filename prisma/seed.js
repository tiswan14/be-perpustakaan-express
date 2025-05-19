import { PrismaClient } from '../generated/prisma/index.js'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    const password = '123456'
    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
        data: {
            nama: 'Admin',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin',
        },
    })

    console.log('Seeding selesai!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
