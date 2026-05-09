import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/auth'

// GET /api/vendors - List vendors with filters (public)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
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
        // Only apply boolean filters when explicitly passed
        if (isVerifiedParam !== null) where.isVerified = isVerifiedParam === 'true'
        if (isFeaturedParam !== null) where.isFeatured = isFeaturedParam === 'true'
        if (search) {
            // SQLite does not support mode:'insensitive' — omit it
            where.OR = [
                { name: { contains: search } },
                { location: { contains: search } },
                { description: { contains: search } },
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
                    packages: { take: 3 },
                    reviews: {
                        take: 3,
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

        const parsedVendors = vendors.map(parseVendor)

        return NextResponse.json({
            success: true,
            message: 'Vendors retrieved successfully',
            data: parsedVendors,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        })
    } catch (error) {
        console.error('Error fetching vendors:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST /api/vendors - Create vendor (ADMIN / SUPER_ADMIN only)
export const POST = withAuth(async (request) => {
    try {
        const body = await request.json()
        const {
            name, slug, description, about, location, address, city,
            phone, email, website, instagram, facebook,
            imageUrl, coverImage,
            isVerified = false, isFeatured = false, respondsQuickly = false,
            features = [], gallery = [], workingHours = {}, details = {},
            categoryIds = [],
        } = body

        if (!name || !slug || !location || !city || !phone || !imageUrl) {
            return NextResponse.json({ error: 'Missing required fields: name, slug, location, city, phone, imageUrl' }, { status: 400 })
        }

        const existingVendor = await prisma.vendor.findUnique({ where: { slug } })
        if (existingVendor) {
            return NextResponse.json({ error: 'Vendor with this slug already exists' }, { status: 409 })
        }

        const vendor = await prisma.vendor.create({
            data: {
                name, slug, description, about, location, address, city,
                phone, email, website, instagram, facebook,
                imageUrl, coverImage,
                isVerified, isFeatured, respondsQuickly,
                features: JSON.stringify(features),
                gallery: JSON.stringify(gallery),
                workingHours: workingHours ? JSON.stringify(workingHours) : null,
                details: details ? JSON.stringify(details) : null,
            },
        })

        if (categoryIds.length > 0) {
            await prisma.vendorCategory.createMany({
                data: categoryIds.map((categoryId: string) => ({ vendorId: vendor.id, categoryId })),
            })
        }

        const created = await prisma.vendor.findUnique({
            where: { id: vendor.id },
            include: { categories: { include: { category: true } } },
        })

        return NextResponse.json(
            { success: true, message: 'Vendor created successfully', data: created ? parseVendor(created) : null },
            { status: 201 }
        )
    } catch (error) {
        console.error('Error creating vendor:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}, ['ADMIN', 'SUPER_ADMIN'])

// ─── helpers ────────────────────────────────────────────────────────────────

function parseVendor(vendor: Record<string, unknown> & {
    features: string
    gallery: string
    workingHours?: string | null
    details?: string | null
    packages?: unknown[]
    reviews?: (Record<string, unknown> & { images: string })[]
    categories?: unknown[]
}) {
    return {
        ...vendor,
        features: safeJsonParse(vendor.features, []),
        gallery: safeJsonParse(vendor.gallery, []),
        workingHours: vendor.workingHours ? safeJsonParse(vendor.workingHours, null) : null,
        details: vendor.details ? safeJsonParse(vendor.details, null) : null,
        packages: vendor.packages?.map((pkg: unknown) => {
            const p = pkg as Record<string, unknown> & { features: string }
            return { ...p, features: safeJsonParse(p.features, []) }
        }),
        reviews: vendor.reviews?.map((r) => ({
            ...r,
            images: safeJsonParse(r.images, []),
        })),
    }
}

function safeJsonParse<T>(value: string, fallback: T): T {
    try {
        return JSON.parse(value) as T
    } catch {
        return fallback
    }
}
