import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/auth'

type Ctx = { params: Promise<{ id: string }> }

export const PATCH = withAuth(async (req: NextRequest, ctx: Ctx) => {
    try {
        const { id } = await ctx.params
        const body = await req.json()

        const data: Record<string, unknown> = {}
        const fields = ['title', 'slug', 'excerpt', 'content', 'coverImage', 'isPublished']
        for (const f of fields) {
            if (body[f] !== undefined) data[f] = body[f]
        }
        if (body.tags !== undefined) data.tags = JSON.stringify(body.tags)
        if (body.isPublished === true) {
            const existing = await prisma.blogPost.findUnique({ where: { id }, select: { publishedAt: true } })
            if (!existing?.publishedAt) data.publishedAt = new Date()
        }

        const updated = await prisma.blogPost.update({ where: { id }, data })
        return NextResponse.json({ success: true, data: updated })
    } catch (error) {
        console.error('Update blog post error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}, ['ADMIN', 'SUPER_ADMIN'])

export const DELETE = withAuth(async (_req: NextRequest, ctx: Ctx) => {
    try {
        const { id } = await ctx.params
        await prisma.blogPost.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete blog post error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}, ['ADMIN', 'SUPER_ADMIN'])
