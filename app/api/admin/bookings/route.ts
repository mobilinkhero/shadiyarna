import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/auth'

export const GET = withAuth(async (request: NextRequest) => {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '50'))
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (status) where.status = status

    const [total, bookings] = await Promise.all([
        prisma.booking.count({ where }),
        prisma.booking.findMany({
            where, skip, take: limit,
            include: {
                user: { select: { id: true, name: true, phone: true, email: true, avatar: true } },
                vendor: { select: { id: true, name: true, slug: true, imageUrl: true, city: true, phone: true } },
                package: { select: { id: true, name: true, price: true } },
                bookingAddons: { include: { addon: true } },
            },
            orderBy: { createdAt: 'desc' },
        }),
    ])

    return NextResponse.json({ success: true, data: bookings, pagination: { page, limit, total } })
}, ['ADMIN', 'SUPER_ADMIN'])
