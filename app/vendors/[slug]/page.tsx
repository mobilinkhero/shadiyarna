import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import VendorDetailClient from '@/components/VendorDetailClient'

function safeJsonParse<T>(value: string, fallback: T): T {
    try { return JSON.parse(value) as T } catch { return fallback }
}

type Ctx = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Ctx) {
    const { slug } = await params
    const vendor = await prisma.vendor.findFirst({ where: { OR: [{ slug }, { id: slug }] } })
    if (!vendor) return { title: 'Vendor Not Found' }
    return {
        title: `${vendor.name} | Shadiyarana`,
        description: vendor.description ?? vendor.about ?? `Book ${vendor.name} for your wedding`,
    }
}

export default async function VendorDetailPage({ params }: Ctx) {
    const { slug } = await params

    const vendor = await prisma.vendor.findFirst({
        where: { OR: [{ slug }, { id: slug }] },
        include: {
            categories: { include: { category: true } },
            packages: { orderBy: { sortOrder: 'asc' } },
            addons: true,
            reviews: {
                include: { user: { select: { id: true, name: true, avatar: true } } },
                orderBy: { createdAt: 'desc' },
                take: 20,
            },
            _count: { select: { reviews: true, bookings: true, wishlists: true } },
        },
    })

    if (!vendor) notFound()

    const gallery = safeJsonParse<string[]>(vendor.gallery, [])
    const features = safeJsonParse<string[]>(vendor.features, [])
    const workingHours = safeJsonParse<Record<string, string>>(vendor.workingHours ?? '{}', {})
    const details = safeJsonParse<Record<string, string>>(vendor.details ?? '{}', {})
    const images = gallery.length > 0 ? gallery : [vendor.imageUrl]

    const similar = await prisma.vendor.findMany({
        where: { id: { not: vendor.id }, categories: { some: { categoryId: vendor.categories[0]?.categoryId } } },
        take: 3,
        include: { categories: { include: { category: true } } },
    })

    const vendorData = {
        id: vendor.id,
        name: vendor.name,
        slug: vendor.slug,
        city: vendor.city,
        address: vendor.address,
        phone: vendor.phone,
        email: vendor.email,
        website: vendor.website,
        instagram: vendor.instagram,
        facebook: vendor.facebook,
        rating: vendor.rating,
        totalReviews: vendor.totalReviews,
        priceRange: vendor.priceRange,
        minPrice: vendor.minPrice,
        maxPrice: vendor.maxPrice,
        isVerified: vendor.isVerified,
        respondsQuickly: vendor.respondsQuickly,
        about: vendor.about,
        description: vendor.description,
        features,
        details,
        workingHours,
        images,
        categoryName: vendor.categories[0]?.category.name ?? 'Vendor',
        categorySlug: vendor.categories[0]?.category.slug ?? '',
        bookings: vendor._count.bookings,
        wishlists: vendor._count.wishlists,
        packages: vendor.packages.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            originalPrice: p.originalPrice,
            description: p.description,
            features: safeJsonParse<string[]>(p.features, []),
            isPopular: p.isPopular,
        })),
        addons: vendor.addons.map(a => ({
            id: a.id,
            name: a.name,
            price: a.price,
            description: a.description,
        })),
        reviews: vendor.reviews.map(r => ({
            id: r.id,
            rating: r.rating,
            comment: r.comment,
            images: safeJsonParse<string[]>(r.images, []),
            userName: r.user.name ?? 'Anonymous',
            userAvatar: r.user.avatar,
            createdAt: r.createdAt.toISOString(),
        })),
        similar: similar.map(sv => ({
            id: sv.id,
            name: sv.name,
            slug: sv.slug,
            city: sv.city,
            rating: sv.rating,
            imageUrl: sv.imageUrl,
            priceRange: sv.priceRange,
            categoryName: sv.categories[0]?.category.name ?? '',
        })),
    }

    return <VendorDetailClient vendor={vendorData} />
}
