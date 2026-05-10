import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/auth'

function safeJsonParse<T>(v: string, fb: T): T {
    try { return JSON.parse(v) as T } catch { return fb }
}

export const GET = withAuth(async () => {
    const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json({
        success: true,
        data: posts.map(p => ({ ...p, tags: safeJsonParse<string[]>(p.tags, []) })),
    })
}, ['ADMIN', 'SUPER_ADMIN'])

export const POST = withAuth(async (request: NextRequest, _ctx, user) => {
    try {
        const body = await request.json()
        const { title, slug, excerpt, content, coverImage, tags = [], isPublished = false } = body

        if (!title || !slug || !content) {
            return NextResponse.json({ error: 'Title, slug and content are required' }, { status: 400 })
        }

        const existing = await prisma.blogPost.findUnique({ where: { slug } })
        if (existing) return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })

        const post = await prisma.blogPost.create({
            data: {
                title, slug, excerpt, content, coverImage,
                tags: JSON.stringify(tags),
                isPublished,
                publishedAt: isPublished ? new Date() : null,
                authorId: user.id,
                authorName: user.name ?? null,
            },
        })

        return NextResponse.json({ success: true, data: { ...post, tags: safeJsonParse<string[]>(post.tags, []) } }, { status: 201 })
    } catch (error) {
        console.error('Create blog post error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}, ['ADMIN', 'SUPER_ADMIN'])
