import { prisma } from '@/lib/prisma'
import { Star, MapPin, CheckCircle, ArrowRight, Zap } from 'lucide-react'
import Link from 'next/link'

function safeJsonParse<T>(v: string, fb: T): T {
    try { return JSON.parse(v) as T } catch { return fb }
}

export default async function FeaturedVendors() {
    const vendors = await prisma.vendor.findMany({
        where: { isFeatured: true },
        take: 6,
        include: {
            categories: { include: { category: true } },
            _count: { select: { reviews: true } },
        },
        orderBy: [{ rating: 'desc' }, { totalReviews: 'desc' }],
    })

    // Fallback static data if DB is empty
    const staticVendors = [
        { id: 's1', name: 'Royal Palm Hall', slug: 'royal-palm-hall', city: 'Karachi', rating: 4.9, totalReviews: 124, priceRange: 'PKR 450,000+', imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80', isVerified: true, respondsQuickly: true, categories: [{ category: { name: 'Venue' } }], _count: { reviews: 124 } },
        { id: 's2', name: 'Dreamy Clicks Photography', slug: 'dreamy-clicks', city: 'Lahore', rating: 4.9, totalReviews: 203, priceRange: 'PKR 120,000+', imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80', isVerified: true, respondsQuickly: true, categories: [{ category: { name: 'Photography' } }], _count: { reviews: 203 } },
        { id: 's3', name: 'Zafran Catering', slug: 'zafran-catering', city: 'Islamabad', rating: 4.7, totalReviews: 87, priceRange: 'PKR 200,000+', imageUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&q=80', isVerified: true, respondsQuickly: false, categories: [{ category: { name: 'Catering' } }], _count: { reviews: 87 } },
        { id: 's4', name: 'Glam by Sana', slug: 'glam-by-sana', city: 'Karachi', rating: 4.8, totalReviews: 112, priceRange: 'PKR 80,000+', imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80', isVerified: true, respondsQuickly: true, categories: [{ category: { name: 'Makeup & Hair' } }], _count: { reviews: 112 } },
        { id: 's5', name: 'Floral Dreams Decor', slug: 'floral-dreams', city: 'Lahore', rating: 4.8, totalReviews: 76, priceRange: 'PKR 150,000+', imageUrl: 'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=600&q=80', isVerified: true, respondsQuickly: false, categories: [{ category: { name: 'Decor' } }], _count: { reviews: 76 } },
        { id: 's6', name: 'Melody Strings Band', slug: 'melody-strings', city: 'Islamabad', rating: 4.6, totalReviews: 65, priceRange: 'PKR 90,000+', imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80', isVerified: false, respondsQuickly: true, categories: [{ category: { name: 'Entertainment' } }], _count: { reviews: 65 } },
    ]

    const displayVendors = vendors.length > 0 ? vendors.map(v => ({
        ...v,
        slug: v.slug,
        imageUrl: (safeJsonParse<string[]>(v.gallery, [])[0]) || v.imageUrl,
    })) : staticVendors

    return (
        <section className="bg-gray-50 py-20">
            <div className="container mx-auto px-4">
                <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1">
                            <Zap className="h-3.5 w-3.5 text-amber-600" />
                            <span className="text-xs font-semibold uppercase tracking-wide text-amber-700">Top Picks</span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Featured Vendors</h2>
                        <p className="mt-2 text-gray-500">Handpicked, verified, and loved by couples across Pakistan</p>
                    </div>
                    <Link href="/vendors" className="flex items-center gap-1 text-sm font-semibold text-amber-600 hover:text-amber-700">
                        View all vendors <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {displayVendors.map((vendor) => (
                        <Link
                            key={vendor.id}
                            href={`/vendors/${vendor.slug}`}
                            className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-amber-200"
                        >
                            {/* Image */}
                            <div className="relative h-52 overflow-hidden">
                                <img
                                    src={vendor.imageUrl}
                                    alt={vendor.name}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                                {/* Badges */}
                                <div className="absolute left-3 top-3 flex gap-2">
                                    {vendor.isVerified && (
                                        <span className="flex items-center gap-1 rounded-full bg-blue-500 px-2.5 py-1 text-xs font-semibold text-white shadow">
                                            <CheckCircle className="h-3 w-3" /> Verified
                                        </span>
                                    )}
                                    {vendor.respondsQuickly && (
                                        <span className="flex items-center gap-1 rounded-full bg-green-500 px-2.5 py-1 text-xs font-semibold text-white shadow">
                                            <Zap className="h-3 w-3" /> Quick Reply
                                        </span>
                                    )}
                                </div>

                                {/* Price */}
                                {vendor.priceRange && (
                                    <span className="absolute bottom-3 right-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-gray-900 shadow backdrop-blur-sm">
                                        {vendor.priceRange}
                                    </span>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <h3 className="truncate font-bold text-gray-900 transition-colors group-hover:text-amber-600">
                                            {vendor.name}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {vendor.categories[0]?.category.name ?? 'Vendor'}
                                        </p>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1.5">
                                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                                        <span className="text-sm font-bold text-gray-900">{vendor.rating.toFixed(1)}</span>
                                    </div>
                                </div>

                                <div className="mt-3 flex items-center justify-between">
                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                        <MapPin className="h-3.5 w-3.5" />
                                        <span>{vendor.city}</span>
                                        <span className="mx-1 text-gray-300">·</span>
                                        <span>{vendor._count.reviews} reviews</span>
                                    </div>
                                    <span className="text-xs font-medium text-amber-600 opacity-0 transition-opacity group-hover:opacity-100">
                                        View details →
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
