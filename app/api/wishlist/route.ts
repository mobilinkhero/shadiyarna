import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/auth'

// GET /api/wishlist - Get authenticated user's wishlist
export const GET = withAuth(async (_request: NextRequest, _ctx, user) => {
    try {
        const wishlist = await prisma.wishlist.findMany({
            where: { userId: user.id },
            include: {
                vendor: {
                    select: {
                        id: true, name: true, slug: true, imageUrl: true,
                        city: true, rating: true, totalReviews: true,
                        priceRange: true, isVerified: true, isFeatured: true,
                        categories: { include: { category: { select: { id: true, name: true, slug: true } } } },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json({ success: true, data: wishlist })
    } catch (error) {
        console.error('Error fetching wishlist:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
})

// POST /api/wishlist - Toggle a vendor in/out of wishlist
export const POST = withAuth(async (request: NextRequest, _ctx, user) => {
    try {
        const body = await request.json()
        const { vendorId } = body

        if (!vendorId) {
            return NextResponse.json({ error: 'vendorId is required' }, { status: 400 })
        }

        const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } })
        if (!vendor) {
            return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
        }

        const existing = await prisma.wishlist.findUnique({
            where: { userId_vendorId: { userId: user.id, vendorId } },
        })

        if (existing) {
            await prisma.wishlist.delete({ where: { id: existing.id } })
            return NextResponse.json({ success: true, action: 'removed', vendorId })
        } else {
            await prisma.wishlist.create({ data: { userId: user.id, vendorId } })
            return NextResponse.json({ success: true, action: 'added', vendorId }, { status: 201 })
        }
    } catch (error) {
        console.error('Error toggling wishlist:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
})
