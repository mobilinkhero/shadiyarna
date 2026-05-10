import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/auth'

export const GET = withAuth(async (request: NextRequest) => {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const role = searchParams.get('role')
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(200, parseInt(searchParams.get('limit') || '50'))
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (role) where.role = role
    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { phone: { contains: search } },
        ]
    }

    const [total, users] = await Promise.all([
        prisma.user.count({ where }),
        prisma.user.findMany({
            where, skip, take: limit,
            select: {
                id: true, name: true, email: true, phone: true, avatar: true,
                role: true, isActive: true, createdAt: true, lastLogin: true,
                _count: { select: { bookings: true, reviews: true, wishlists: true } },
            },
            orderBy: { createdAt: 'desc' },
        }),
    ])

    return NextResponse.json({ success: true, data: users, pagination: { page, limit, total } })
}, ['ADMIN', 'SUPER_ADMIN'])
