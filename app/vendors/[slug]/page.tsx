import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Star, MapPin, CheckCircle, Zap, Package, Plus, Clock } from 'lucide-react'
import Link from 'next/link'
import GalleryGrid from '@/components/GalleryGrid'
import VendorTabs from '@/components/VendorTabs'

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
                take: 10,
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
    const categoryName = vendor.categories[0]?.category.name ?? 'Vendor'

    const similar = await prisma.vendor.findMany({
        where: {
            id: { not: vendor.id },
            categories: { some: { categoryId: vendor.categories[0]?.categoryId } },
        },
        take: 4,
        include: { categories: { include: { category: true } } },
    })

    // Prepare serializable data for client components
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
        isVerified: vendor.isVerified,
        respondsQuickly: vendor.respondsQuickly,
        about: vendor.about,
        description: vendor.description,
        features,
        details,
        workingHours,
        images,
        categoryName,
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

    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            {/* Breadcrumb */}
            <div className="border-b bg-white px-4 py-2 text-xs text-gray-500">
                <Link href="/" className="hover:text-[#B8860B]">Home</Link>
                <span className="mx-1">/</span>
                <Link href="/vendors" className="hover:text-[#B8860B]">Vendors</Link>
                <span className="mx-1">/</span>
                <span className="text-gray-900">{vendor.name}</span>
            </div>

            {/* Gallery */}
            <GalleryGrid images={images} vendorName={vendor.name} />

            {/* Quick info */}
            <div className="bg-white px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-xl font-bold text-gray-900">{vendor.name}</h1>
                            {vendor.isVerified && (
                                <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600">
                                    <CheckCircle className="h-3 w-3" /> Verified
                                </span>
                            )}
                            {vendor.respondsQuickly && (
                                <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-600">
                                    <Zap className="h-3 w-3" /> Quick Reply
                                </span>
                            )}
                        </div>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                            <span className="rounded-full bg-[#FFF8EE] px-2.5 py-0.5 text-xs font-semibold text-[#B8860B]">{categoryName}</span>
                            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{vendor.city}</span>
                            <span>{vendor._count.bookings} bookings</span>
                        </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-center rounded-2xl bg-amber-50 px-4 py-2 text-center">
                        <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                            <span className="text-xl font-bold text-gray-900">{vendor.rating.toFixed(1)}</span>
                        </div>
                        <span className="text-xs text-gray-500">{vendor._count.reviews} reviews</span>
                    </div>
                </div>

                {/* Price */}
                {vendor.priceRange && (
                    <div className="mt-3">
                        <span className="rounded-xl bg-[#FFF8EE] px-3 py-1.5 text-base font-bold text-[#B8860B]">
                            {vendor.priceRange}
                        </span>
                    </div>
                )}

                {/* About */}
                {(vendor.about || vendor.description) && (
                    <p className="mt-3 text-sm leading-relaxed text-gray-600">{vendor.about || vendor.description}</p>
                )}

                {/* Features */}
                {features.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {features.map((f, i) => (
                            <span key={i} className="flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-600">
                                <CheckCircle className="h-3 w-3 text-green-500" /> {f}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Tabs + content — client component handles tab switching */}
            <VendorTabs vendor={vendorData} />
        </div>
    )
}
