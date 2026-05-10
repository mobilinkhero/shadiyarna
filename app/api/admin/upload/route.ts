import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { verifyToken } from '@/lib/auth'

/**
 * POST /api/admin/upload
 * Uploads an image file and returns the public URL.
 * Admin only.
 *
 * In production, swap this to Cloudflare R2 / S3 / UploadThing.
 * For now, it saves to /public/uploads (works on Vercel for small files, but prefer cloud).
 */
export async function POST(request: NextRequest) {
    const user = verifyToken(request)
    if (!user || !['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const formData = await request.formData()
        const file = formData.get('file') as File | null
        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        const maxSize = 5 * 1024 * 1024 // 5MB
        if (file.size > maxSize) {
            return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 })
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: 'Only images allowed' }, { status: 400 })
        }

        // Generate safe filename
        const ext = file.name.split('.').pop() || 'jpg'
        const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`

        const isProd = process.env.NODE_ENV === 'production'

        if (isProd) {
            // On Vercel, the filesystem is read-only. Return a data URL or require cloud storage.
            // For now, we'll base64 encode small images. You should swap this for S3/R2 in production.
            const buffer = Buffer.from(await file.arrayBuffer())
            const base64 = buffer.toString('base64')
            const dataUrl = `data:${file.type};base64,${base64}`
            return NextResponse.json({
                url: dataUrl,
                warning: 'Using base64 fallback. For production, configure cloud storage (R2/S3/UploadThing).',
            })
        }

        // Dev: save to /public/uploads
        const uploadDir = path.join(process.cwd(), 'public', 'uploads')
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true })
        }

        const buffer = Buffer.from(await file.arrayBuffer())
        await writeFile(path.join(uploadDir, filename), buffer)

        return NextResponse.json({ url: `/uploads/${filename}` })
    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }
}
