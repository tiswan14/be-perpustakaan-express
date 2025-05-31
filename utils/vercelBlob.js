// utils/vercelBlob.js
import { put } from '@vercel/blob'

export async function uploadToVercelBlob(fileBuffer, fileName, mimeType) {
    const response = await put(fileName, fileBuffer, {
        access: 'public',
        contentType: mimeType,
        token: process.env.BLOB_READ_WRITE_TOKEN, // kamu sudah punya
    })

    return response.url // Ini adalah URL public yang bisa langsung dibuka
}
