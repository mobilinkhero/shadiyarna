import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/flutter/vendors
 * Public endpoint for the Flutter app.
 * Supports: page, limit, city, category, minRating, isVerified, isFeatured, search
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
        const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')))
        const city = searchParams.get('city')
        const category = searchParams.get('category')
        const minRating = parseFloat(searchParams.get('minRating') || '0')
        const isVerifiedParam = searchParams.get('isVerified')
        const isFeaturedParam = searchParams.get('isFeatured')
        const search = searchParams.get('search')

        const skip = (page - 1) * limit
        const where: Record<string, unknown> = {}

        if (city) where.city = city
        if (minRating > 0) where.rating = { gte: minRating }
        if (isVerifiedParam !== null) where.isVerified = isVerifiedParam === 'true'
        if (isFeaturedParam !== null) where.isFeatured = isFeaturedParam === 'true'
        if (search) {
            where.OR = [
                { name: { contains: search } },
                { location: { contains: search } },
                { description: { contains: search } },
                { city: { contains: search } },
            ]
        }

        if (category) {
            const vendorCategories = await prisma.vendorCategory.findMany({
                where: {
                    category: {
                        OR: [
                            { id: category },
                            { slug: category },
                            { name: { contains: category } },
                        ],
                    },
                },
                select: { vendorId: true },
            })
            const vendorIds = vendorCategories.map((vc) => vc.vendorId)
            where.id = { in: vendorIds.length > 0 ? vendorIds : ['__none__'] }
        }

        const [total, vendors] = await Promise.all([
            prisma.vendor.count({ where }),
            prisma.vendor.findMany({
                where,
                skip,
                take: limit,
                include: {
                    categories: { include: { category: true } },
                    packages: { orderBy: { sortOrder: 'asc' } },
                    addons: true,
                    reviews: {
                        take: 5,
                        orderBy: { createdAt: 'desc' },
                        include: {
                            user: { select: { id: true, name: true, avatar: true } },
                        },
                    },
                },
                orderBy: [
                    { isFeatured: 'desc' },
                    { rating: 'desc' },
                    { totalReviews: 'desc' },
                ],
            }),
        ])

        const data = vendors.map((v) => ({
            id: v.id,
            name: v.name,
            slug: v.slug,
            description: v.description,
            about: v.about,
            location: v.location,
            address: v.address,
            city: v.city,
            rating: v.rating,
            totalReviews: v.totalReviews,
            priceRange: v.priceRange,
            minPrice: v.minPrice,
            maxPrice: v.maxPrice,
            imageUrl: v.imageUrl,
            coverImage: v.coverImage,
            isVerified: v.isVerified,
            isFeatured: v.isFeatured,
            respondsQuickly: v.respondsQuickly,
            phone: v.phone,
            email: v.email,
            website: v.website,
            instagram: v.instagram,
            facebook: v.facebook,
            features: safeJsonParse(v.features, []),
            gallery: safeJsonParse(v.gallery, []),
            workingHours: v.workingHours ? safeJsonParse(v.workingHours, null) : null,
            details: v.details ? safeJsonParse(v.details, null) : null,
            categories: v.categories.map((vc) => ({
                id: vc.category.id,
                name: vc.category.name,
                slug: vc.category.slug,
                icon: vc.category.icon,
                imageUrl: vc.category.imageUrl,
            })),
            packages: v.packages.map((p) => ({
                id: p.id,
                name: p.name,
                description: p.description,
                price: p.price,
                originalPrice: p.originalPrice,
                features: safeJsonParse(p.features, []),
                isPopular: p.isPopular,
                sortOrder: p.sortOrder,
            })),
            addons: v.addons.map((a) => ({
                id: a.id,
                name: a.name,
                description: a.description,
                price: a.price,
            })),
            reviews: v.reviews.map((r) => ({
                id: r.id,
                rating: r.rating,
                comment: r.comment,
                images: safeJsonParse(r.images, []),
                user: r.user,
                createdAt: r.createdAt,
            })),
            createdAt: v.createdAt,
            updatedAt: v.updatedAt,
        }))

        return NextResponse.json({
            success: true,
            message: 'Vendors retrieved successfully',
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        })
    } catch (error) {
        console.error('Flutter vendors error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}

function safeJsonParse<T>(value: string, fallback: T): T {
    try {
        return JSON.parse(value) as T
    } catch {
        return fallback
    }
}
