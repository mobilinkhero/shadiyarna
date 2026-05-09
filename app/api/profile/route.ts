import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/auth'

// GET /api/profile - Get authenticated user's profile
export const GET = withAuth(async (_request: NextRequest, _ctx, user) => {
    try {
        const profile = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                avatar: true,
                role: true,
                isActive: true,
                createdAt: true,
                lastLogin: true,
                _count: {
                    select: {
                        bookings: true,
                        reviews: true,
                        wishlists: true,
                    },
                },
            },
        })

        if (!profile) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({ success: true, data: profile })
    } catch (error) {
        console.error('Error fetching profile:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
})

// PATCH /api/profile - Update authenticated user's profile
export const PATCH = withAuth(async (request: NextRequest, _ctx, user) => {
    try {
        const body = await request.json()
        const { name, avatar } = body

        const updateData: Record<string, unknown> = {}
        if (name !== undefined) updateData.name = name
        if (avatar !== undefined) updateData.avatar = avatar

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
        }

        const updated = await prisma.user.update({
            where: { id: user.id },
            data: updateData,
            select: {
                id: true, name: true, email: true, phone: true,
                avatar: true, role: true, createdAt: true,
            },
        })

        return NextResponse.json({ success: true, message: 'Profile updated', data: updated })
    } catch (error) {
        console.error('Error updating profile:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
})
