import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/auth'

/**
 * POST /api/admin/notifications/broadcast
 * Send a notification to all users or a specific role.
 * Body: { title, message, type, link?, targetRole?: 'USER' | 'VENDOR' | 'ALL' }
 */
export const POST = withAuth(async (request: NextRequest) => {
    try {
        const body = await request.json()
        const { title, message, type = 'INFO', link, targetRole = 'ALL' } = body

        if (!title || !message) {
            return NextResponse.json({ error: 'Title and message are required' }, { status: 400 })
        }

        const where: Record<string, unknown> = { isActive: true }
        if (targetRole !== 'ALL') where.role = targetRole

        const users = await prisma.user.findMany({ where, select: { id: true } })
        if (users.length === 0) {
            return NextResponse.json({ error: 'No target users found' }, { status: 400 })
        }

        await prisma.notification.createMany({
            data: users.map(u => ({ userId: u.id, title, message, type, link: link ?? null })),
        })

        return NextResponse.json({ success: true, sentTo: users.length })
    } catch (error) {
        console.error('Broadcast error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}, ['ADMIN', 'SUPER_ADMIN'])
