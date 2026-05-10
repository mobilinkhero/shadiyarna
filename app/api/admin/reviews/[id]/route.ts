import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/auth'

type Ctx = { params: Promise<{ id: string }> }

export const DELETE = withAuth(async (_req: NextRequest, ctx: Ctx) => {
    try {
        const { id } = await ctx.params
        const review = await prisma.review.findUnique({ where: { id } })
        if (!review) return NextResponse.json({ error: 'Not found' }, { status: 404 })

        await prisma.review.delete({ where: { id } })

        // Recalculate vendor rating
        const agg = await prisma.review.aggregate({
            where: { vendorId: review.vendorId },
            _avg: { rating: true }, _count: { rating: true },
        })
        await prisma.vendor.update({
            where: { id: review.vendorId },
            data: { rating: agg._avg.rating ?? 0, totalReviews: agg._count.rating },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete review error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}, ['ADMIN', 'SUPER_ADMIN'])
