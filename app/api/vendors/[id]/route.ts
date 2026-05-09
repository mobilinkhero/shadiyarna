import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/auth'

type Ctx = { params: Promise<{ id: string }> }

// GET /api/vendors/[id] - Get vendor by ID or slug (public)
export async function GET(request: NextRequest, ctx: Ctx) {
    try {
        const { id } = await ctx.params

        const vendor = await prisma.vendor.findFirst({
            where: { OR: [{ id }, { slug: id }] },
            include: {
                categories: { include: { category: true } },
                packages: { orderBy: { sortOrder: 'asc' } },
                addons: true,
                reviews: {
                    include: {
                        user: { select: { id: true, name: true, avatar: true } },
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
                _count: { select: { reviews: true, bookings: true, wishlists: true } },
            },
        })

        if (!vendor) {
            return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
        }

        const parsed = {
            ...vendor,
            features: safeJsonParse(vendor.features, []),
            gallery: safeJsonParse(vendor.gallery, []),
            workingHours: vendor.workingHours ? safeJsonParse(vendor.workingHours, null) : null,
            details: vendor.details ? safeJsonParse(vendor.details, null) : null,
            packages: vendor.packages.map((p) => ({
                ...p,
                features: safeJsonParse(p.features, []),
            })),
            addons: vendor.addons,
            reviews: vendor.reviews.map((r) => ({
                ...r,
                images: safeJsonParse(r.images, []),
            })),
        }

        return NextResponse.json({ success: true, message: 'Vendor retrieved successfully', data: parsed })
    } catch (error) {
        console.error('Error fetching vendor:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// PUT /api/vendors/[id] - Update vendor (ADMIN / SUPER_ADMIN only)
export const PUT = withAuth(async (request, ctx) => {
    try {
        const { id } = await ctx.params
        const body = await request.json()

        const existing = await prisma.vendor.findUnique({ where: { id } })
        if (!existing) {
            return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
        }

        if (body.slug && body.slug !== existing.slug) {
            const slugTaken = await prisma.vendor.findUnique({ where: { slug: body.slug } })
            if (slugTaken) {
                return NextResponse.json({ error: 'Slug already in use' }, { status: 409 })
            }
        }

        const updateData: Record<string, unknown> = {}
        const scalarFields = [
            'name', 'slug', 'description', 'about', 'location', 'address', 'city',
            'phone', 'email', 'website', 'instagram', 'facebook',
            'imageUrl', 'coverImage', 'isVerified', 'isFeatured', 'respondsQuickly',
            'priceRange', 'minPrice', 'maxPrice',
        ]
        for (const f of scalarFields) {
            if (body[f] !== undefined) updateData[f] = body[f]
        }
        if (body.features !== undefined) updateData.features = JSON.stringify(body.features)
        if (body.gallery !== undefined) updateData.gallery = JSON.stringify(body.gallery)
        if (body.workingHours !== undefined) updateData.workingHours = body.workingHours ? JSON.stringify(body.workingHours) : null
        if (body.details !== undefined) updateData.details = body.details ? JSON.stringify(body.details) : null

        const updated = await prisma.vendor.update({
            where: { id },
            data: updateData,
            include: { categories: { include: { category: true } } },
        })

        if (body.categoryIds !== undefined) {
            await prisma.vendorCategory.deleteMany({ where: { vendorId: id } })
            if (body.categoryIds.length > 0) {
                await prisma.vendorCategory.createMany({
                    data: body.categoryIds.map((cid: string) => ({ vendorId: id, categoryId: cid })),
                })
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Vendor updated successfully',
            data: {
                ...updated,
                features: safeJsonParse(updated.features, []),
                gallery: safeJsonParse(updated.gallery, []),
                workingHours: updated.workingHours ? safeJsonParse(updated.workingHours, null) : null,
                details: updated.details ? safeJsonParse(updated.details, null) : null,
            },
        })
    } catch (error) {
        console.error('Error updating vendor:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}, ['ADMIN', 'SUPER_ADMIN'])

// DELETE /api/vendors/[id] - Delete vendor (ADMIN / SUPER_ADMIN only)
export const DELETE = withAuth(async (_request, ctx) => {
    try {
        const { id } = await ctx.params

        const existing = await prisma.vendor.findUnique({ where: { id } })
        if (!existing) {
            return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
        }

        await prisma.vendor.delete({ where: { id } })
        return NextResponse.json({ success: true, message: 'Vendor deleted successfully' })
    } catch (error) {
        console.error('Error deleting vendor:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}, ['ADMIN', 'SUPER_ADMIN'])

function safeJsonParse<T>(value: string, fallback: T): T {
    try {
        return JSON.parse(value) as T
    } catch {
        return fallback
    }
}
