import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Star, MapPin, CheckCircle, SlidersHorizontal } from 'lucide-react'
import VendorFilters from '@/components/VendorFilters'

function safeJsonParse<T>(value: string, fallback: T): T {
    try { return JSON.parse(value) as T } catch { return fallback }
}

interface SearchParams {
    city?: string
    category?: string
    search?: string
    page?: string
    verified?: string
}

export default async function VendorsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const sp = await searchParams
    const page = Math.max(1, parseInt(sp.page || '1'))
    const limit = 12
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (sp.city) where.city = sp.city
    if (sp.verified === 'true') where.isVerified = true
    if (sp.search) {
        where.OR = [
            { name: { contains: sp.search } },
            { description: { contains: sp.search } },
            { city: { contains: sp.search } },
        ]
    }

    if (sp.category) {
        const vcs = await prisma.vendorCategory.findMany({
            where: { category: { OR: [{ id: sp.category }, { slug: sp.category }] } },
            select: { vendorId: true },
        })
        where.id = { in: vcs.length > 0 ? vcs.map(v => v.vendorId) : ['__none__'] }
    }

    const [total, vendors, categories, cities] = await Promise.all([
        prisma.vendor.count({ where }),
        prisma.vendor.findMany({
            where, skip, take: limit,
            include: {
                categories: { include: { category: true } },
                _count: { select: { reviews: true } },
            },
            orderBy: [{ isFeatured: 'desc' }, { rating: 'desc' }],
        }),
        prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
        prisma.vendor.findMany({ select: { city: true }, distinct: ['city'], orderBy: { city: 'asc' } }),
    ])

    const totalPages = Math.ceil(total / limit)

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-gray-900">Wedding Vendors</h1>
                    <p className="mt-2 text-gray-600">{total} vendors found{sp.city ? ` in ${sp.city}` : ''}</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col gap-8 lg:flex-row">
                    {/* Sidebar filters */}
                    <aside className="w-full lg:w-64 shrink-0">
                        <VendorFilters
                            categories={categories}
                            cities={cities.map(c => c.city)}
                            currentCity={sp.city}
                            currentCategory={sp.category}
                            currentSearch={sp.search}
                            currentVerified={sp.verified}
                        />
                    </aside>

                    {/* Vendor grid */}
                    <div className="flex-1">
                        {vendors.length === 0 ? (
                            <div className="rounded-2xl bg-white p-16 text-center shadow-sm">
                                <SlidersHorizontal className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                                <h3 className="text-lg font-semibold text-gray-900">No vendors found</h3>
                                <p className="mt-2 text-gray-500">Try adjusting your filters</p>
                                <Link href="/vendors" className="mt-4 inline-block rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700">
                                    Clear Filters
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                    {vendors.map((vendor) => {
                                        const gallery = safeJsonParse<string[]>(vendor.gallery, [])
                                        const image = gallery[0] || vendor.imageUrl
                                        return (
                                            <Link
                                                key={vendor.id}
                                                href={`/vendors/${vendor.slug}`}
                                                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5"
                                            >
                                                <div className="relative h-48 overflow-hidden bg-gray-100">
                                                    <img
                                                        src={image}
                                                        alt={vendor.name}
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                    {vendor.isFeatured && (
                                                        <span className="absolute left-3 top-3 rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-semibold text-white">
                                                            Featured
                                                        </span>
                                                    )}
                                                    {vendor.priceRange && (
                                                        <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-medium text-gray-800 backdrop-blur-sm">
                                                            {vendor.priceRange}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="p-4">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div>
                                                            <div className="flex items-center gap-1.5">
                                                                <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                                                                    {vendor.name}
                                                                </h3>
                                                                {vendor.isVerified && (
                                                                    <CheckCircle className="h-4 w-4 shrink-0 text-blue-500" />
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-gray-500">
                                                                {vendor.categories[0]?.category.name ?? 'Vendor'}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 shrink-0">
                                                            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                                                            <span className="text-sm font-semibold text-gray-900">{vendor.rating.toFixed(1)}</span>
                                                        </div>
                                                    </div>
                                                    <div className="mt-3 flex items-center gap-1 text-sm text-gray-500">
                                                        <MapPin className="h-3.5 w-3.5" />
                                                        <span>{vendor.city}</span>
                                                        <span className="mx-1">·</span>
                                                        <span>{vendor._count.reviews} reviews</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        )
                                    })}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-8 flex items-center justify-center gap-2">
                                        {page > 1 && (
                                            <Link
                                                href={`/vendors?${new URLSearchParams({ ...sp, page: String(page - 1) })}`}
                                                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                            >
                                                Previous
                                            </Link>
                                        )}
                                        <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
                                        {page < totalPages && (
                                            <Link
                                                href={`/vendors?${new URLSearchParams({ ...sp, page: String(page + 1) })}`}
                                                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                            >
                                                Next
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
