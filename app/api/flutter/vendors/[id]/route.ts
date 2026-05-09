import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Ctx = { params: Promise<{ id: string }> }

/**
 * GET /api/flutter/vendors/[id]
 * Returns full vendor detail for the Flutter app (public).
 * Accepts either the vendor's id or slug.
 */
export async function GET(_request: NextRequest, ctx: Ctx) {
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
                    take: 20,
                },
                _count: { select: { reviews: true, bookings: true, wishlists: true } },
            },
        })

        if (!vendor) {
            return NextResponse.json({ success: false, error: 'Vendor not found' }, { status: 404 })
        }

        const data = {
            id: vendor.id,
            name: vendor.name,
            slug: vendor.slug,
            description: vendor.description,
            about: vendor.about,
            location: vendor.location,
            address: vendor.address,
            city: vendor.city,
            rating: vendor.rating,
            totalReviews: vendor.totalReviews,
            priceRange: vendor.priceRange,
            minPrice: vendor.minPrice,
            maxPrice: vendor.maxPrice,
            imageUrl: vendor.imageUrl,
            coverImage: vendor.coverImage,
            isVerified: vendor.isVerified,
            isFeatured: vendor.isFeatured,
            respondsQuickly: vendor.respondsQuickly,
            phone: vendor.phone,
            email: vendor.email,
            website: vendor.website,
            instagram: vendor.instagram,
            facebook: vendor.facebook,
            features: safeJsonParse(vendor.features, []),
            gallery: safeJsonParse(vendor.gallery, []),
            workingHours: vendor.workingHours ? safeJsonParse(vendor.workingHours, null) : null,
            details: vendor.details ? safeJsonParse(vendor.details, null) : null,
            categories: vendor.categories.map((vc) => ({
                id: vc.category.id,
                name: vc.category.name,
                slug: vc.category.slug,
                icon: vc.category.icon,
                imageUrl: vc.category.imageUrl,
            })),
            packages: vendor.packages.map((p) => ({
                id: p.id,
                name: p.name,
                description: p.description,
                price: p.price,
                originalPrice: p.originalPrice,
                features: safeJsonParse(p.features, []),
                isPopular: p.isPopular,
                sortOrder: p.sortOrder,
            })),
            addons: vendor.addons.map((a) => ({
                id: a.id,
                name: a.name,
                description: a.description,
                price: a.price,
            })),
            reviews: vendor.reviews.map((r) => ({
                id: r.id,
                rating: r.rating,
                comment: r.comment,
                images: safeJsonParse(r.images, []),
                user: r.user,
                createdAt: r.createdAt,
            })),
            stats: vendor._count,
            createdAt: vendor.createdAt,
            updatedAt: vendor.updatedAt,
        }

        return NextResponse.json({ success: true, message: 'Vendor retrieved successfully', data })
    } catch (error) {
        console.error('Flutter vendor detail error:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}

function safeJsonParse<T>(value: string, fallback: T): T {
    try {
        return JSON.parse(value) as T
    } catch {
        return fallback
    }
}
