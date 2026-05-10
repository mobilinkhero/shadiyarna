import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/auth'

export const GET = withAuth(async (request: NextRequest) => {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '50'))
    const skip = (page - 1) * limit

    const [total, reviews] = await Promise.all([
        prisma.review.count(),
        prisma.review.findMany({
            skip, take: limit,
            include: {
                user: { select: { id: true, name: true, phone: true, avatar: true } },
                vendor: { select: { id: true, name: true, slug: true, imageUrl: true } },
            },
            orderBy: { createdAt: 'desc' },
        }),
    ])

    return NextResponse.json({ success: true, data: reviews, pagination: { page, limit, total } })
}, ['ADMIN', 'SUPER_ADMIN'])
