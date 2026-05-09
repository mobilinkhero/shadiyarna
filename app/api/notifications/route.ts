import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/auth'

// GET /api/notifications - Get notifications for authenticated user
export const GET = withAuth(async (request: NextRequest, _ctx, user) => {
    try {
        const { searchParams } = new URL(request.url)
        const unreadOnly = searchParams.get('unread') === 'true'
        const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
        const limit = Math.min(50, parseInt(searchParams.get('limit') || '20'))
        const skip = (page - 1) * limit

        const where: Record<string, unknown> = { userId: user.id }
        if (unreadOnly) where.isRead = false

        const [total, notifications, unreadCount] = await Promise.all([
            prisma.notification.count({ where }),
            prisma.notification.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.notification.count({ where: { userId: user.id, isRead: false } }),
        ])

        return NextResponse.json({
            success: true,
            data: notifications,
            unreadCount,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        })
    } catch (error) {
        console.error('Error fetching notifications:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
})

// PATCH /api/notifications - Mark all as read
export const PATCH = withAuth(async (_request: NextRequest, _ctx, user) => {
    try {
        await prisma.notification.updateMany({
            where: { userId: user.id, isRead: false },
            data: { isRead: true },
        })
        return NextResponse.json({ success: true, message: 'All notifications marked as read' })
    } catch (error) {
        console.error('Error marking notifications read:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
})
