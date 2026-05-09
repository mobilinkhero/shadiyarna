import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/auth'

type Ctx = { params: Promise<{ id: string }> }

// PATCH /api/notifications/[id] - Mark single notification as read
export const PATCH = withAuth(async (_request: NextRequest, ctx: Ctx, user) => {
    try {
        const { id } = await ctx.params

        const notification = await prisma.notification.findUnique({ where: { id } })
        if (!notification) {
            return NextResponse.json({ error: 'Notification not found' }, { status: 404 })
        }
        if (notification.userId !== user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const updated = await prisma.notification.update({
            where: { id },
            data: { isRead: true },
        })

        return NextResponse.json({ success: true, data: updated })
    } catch (error) {
        console.error('Error updating notification:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
})
