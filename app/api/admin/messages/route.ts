import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/auth'

export const GET = withAuth(async () => {
    const chats = await prisma.chat.findMany({
        orderBy: { lastMessageAt: 'desc' },
        take: 100,
        include: {
            user: { select: { id: true, name: true, phone: true, avatar: true } },
            vendor: { select: { id: true, name: true, imageUrl: true } },
            _count: { select: { messages: true } },
        },
    })
    return NextResponse.json({ success: true, data: chats })
}, ['ADMIN', 'SUPER_ADMIN'])
