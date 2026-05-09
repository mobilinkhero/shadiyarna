import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/auth'

// GET /api/reviews?vendorId=xxx - Get reviews for a vendor (public)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const vendorId = searchParams.get('vendorId')
        const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
        const limit = Math.min(50, parseInt(searchParams.get('limit') || '20'))
        const skip = (page - 1) * limit

        if (!vendorId) {
            return NextResponse.json({ error: 'vendorId query param is required' }, { status: 400 })
        }

        const [total, reviews] = await Promise.all([
            prisma.review.count({ where: { vendorId } }),
            prisma.review.findMany({
                where: { vendorId },
                skip,
                take: limit,
                include: {
                    user: { select: { id: true, name: true, avatar: true } },
                },
                orderBy: { createdAt: 'desc' },
            }),
        ])

        const data = reviews.map((r) => ({
            ...r,
            images: safeJsonParse(r.images, []),
        }))

        return NextResponse.json({
            success: true,
            data,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        })
    } catch (error) {
        console.error('Error fetching reviews:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST /api/reviews - Submit a review (authenticated)
export const POST = withAuth(async (request: NextRequest, _ctx, user) => {
    try {
        const body = await request.json()
        const { vendorId, rating, comment, images = [] } = body

        if (!vendorId || rating === undefined) {
            return NextResponse.json({ error: 'vendorId and rating are required' }, { status: 400 })
        }

        const ratingNum = parseInt(rating)
        if (ratingNum < 1 || ratingNum > 5) {
            return NextResponse.json({ error: 'rating must be between 1 and 5' }, { status: 400 })
        }

        // Verify vendor exists
        const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } })
        if (!vendor) {
            return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
        }

        // Upsert — one review per user per vendor
        const review = await prisma.review.upsert({
            where: { userId_vendorId: { userId: user.id, vendorId } },
            create: {
                userId: user.id,
                vendorId,
                rating: ratingNum,
                comment: comment || null,
                images: JSON.stringify(images),
            },
            update: {
                rating: ratingNum,
                comment: comment || null,
                images: JSON.stringify(images),
            },
            include: {
                user: { select: { id: true, name: true, avatar: true } },
            },
        })

        // Recalculate vendor rating
        const agg = await prisma.review.aggregate({
            where: { vendorId },
            _avg: { rating: true },
            _count: { rating: true },
        })
        await prisma.vendor.update({
            where: { id: vendorId },
            data: {
                rating: agg._avg.rating ?? 0,
                totalReviews: agg._count.rating,
            },
        })

        return NextResponse.json({
            success: true,
            message: 'Review submitted successfully',
            data: { ...review, images: safeJsonParse(review.images, []) },
        }, { status: 201 })
    } catch (error) {
        console.error('Error submitting review:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
})

function safeJsonParse<T>(value: string, fallback: T): T {
    try {
        return JSON.parse(value) as T
    } catch {
        return fallback
    }
}
