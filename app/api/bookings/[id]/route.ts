import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/auth'

type Ctx = { params: Promise<{ id: string }> }

// GET /api/bookings/[id] - Get booking detail (owner or admin)
export const GET = withAuth(async (_request: NextRequest, ctx: Ctx, user) => {
    try {
        const { id } = await ctx.params

        const booking = await prisma.booking.findUnique({
            where: { id },
            include: {
                vendor: {
                    select: {
                        id: true, name: true, slug: true, imageUrl: true,
                        city: true, phone: true, email: true, rating: true,
                    },
                },
                package: true,
                bookingAddons: {
                    include: { addon: true },
                },
                user: { select: { id: true, name: true, phone: true, email: true } },
            },
        })

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
        }

        // Only the booking owner or an admin can view it
        const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(user.role)
        if (booking.userId !== user.id && !isAdmin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        return NextResponse.json({ success: true, data: booking })
    } catch (error) {
        console.error('Error fetching booking:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
})

// PATCH /api/bookings/[id] - Update booking status (admin) or cancel (owner)
export const PATCH = withAuth(async (request: NextRequest, ctx: Ctx, user) => {
    try {
        const { id } = await ctx.params
        const body = await request.json()

        const booking = await prisma.booking.findUnique({ where: { id } })
        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
        }

        const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(user.role)
        const isOwner = booking.userId === user.id

        if (!isAdmin && !isOwner) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const allowedStatuses = isAdmin
            ? ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'REJECTED']
            : ['CANCELLED'] // users can only cancel their own bookings

        const { status, notes } = body

        if (status && !allowedStatuses.includes(status)) {
            return NextResponse.json(
                { error: `Invalid status. Allowed: ${allowedStatuses.join(', ')}` },
                { status: 400 }
            )
        }

        const updated = await prisma.booking.update({
            where: { id },
            data: {
                ...(status ? { status } : {}),
                ...(notes !== undefined ? { notes } : {}),
            },
        })

        return NextResponse.json({ success: true, message: 'Booking updated', data: updated })
    } catch (error) {
        console.error('Error updating booking:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
})
