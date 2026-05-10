import { prisma } from '@/lib/prisma'
import { Star, MapPin, CheckCircle, Zap } from 'lucide-react'
import Link from 'next/link'

function safeJsonParse<T>(v: string, fb: T): T {
    try { return JSON.parse(v) as T } catch { return fb }
}

const staticVendors = [
    { id: 's1', name: 'Royal Palm Hall', slug: 'royal-palm-hall', city: 'Lahore', rating: 4.8, totalReviews: 320, priceRange: 'Rs. 450,000', imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&q=80', isVerified: true, respondsQuickly: true, categories: [{ category: { name: 'Venue' } }] },
    { id: 's2', name: 'Dreamy Clicks Photography', slug: 'dreamy-clicks-photography', city: 'Lahore', rating: 4.9, totalReviews: 215, priceRange: 'Rs. 150,000', imageUrl: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400&q=80', isVerified: true, respondsQuickly: true, categories: [{ category: { name: 'Photography' } }] },
    { id: 's3', name: 'Glam by Sana', slug: 'glam-by-sana', city: 'Karachi', rating: 4.8, totalReviews: 189, priceRange: 'Rs. 25,000', imageUrl: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&q=80', isVerified: false, respondsQuickly: false, categories: [{ category: { name: 'Makeup' } }] },
    { id: 's4', name: 'Zafran Catering', slug: 'zafran-catering', city: 'Lahore', rating: 4.7, totalReviews: 142, priceRange: 'Rs. 1,200/head', imageUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=400&q=80', isVerified: true, respondsQuickly: false, categories: [{ category: { name: 'Catering' } }] },
    { id: 's5', name: 'Elegance Decor Studio', slug: 'floral-dreams-decor', city: 'Lahore', rating: 4.5, totalReviews: 76, priceRange: 'Rs. 80,000', imageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=80', isVerified: false, respondsQuickly: false, categories: [{ category: { name: 'Decor' } }] },
    { id: 's6', name: 'Nadia Hussain Studio', slug: 'glam-by-sana', city: 'Karachi', rating: 4.9, totalReviews: 530, priceRange: 'Rs. 45,000', imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80', isVerified: true, respondsQuickly: true, categories: [{ category: { name: 'Makeup' } }] },
]

interface Props { title?: string; filter?: 'featured' | 'top' }

export default async function FeaturedVendors({ title = 'Trending Now 🔥', filter = 'featured' }: Props) {
    const vendors = await prisma.vendor.findMany({
        where: filter === 'featured' ? { isFeatured: true } : { rating: { gte: 4.7 } },
        take: 6,
        include: {
            categories: { include: { category: true } },
        },
        orderBy: [{ rating: 'desc' }, { totalReviews: 'desc' }],
    })

    const displayVendors = vendors.length > 0 ? vendors.map(v => ({
        id: v.id,
        name: v.name,
        slug: v.slug,
        city: v.city,
        rating: v.rating,
        totalReviews: v.totalReviews,
        priceRange: v.priceRange,
        imageUrl: safeJsonParse<string[]>(v.gallery, [])[0] || v.imageUrl,
        isVerified: v.isVerified,
        respondsQuickly: v.respondsQuickly,
        categories: v.categories,
    })) : staticVendors

    return (
        <section className="bg-[#FAFAFA] px-4 py-6">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                <Link href="/vendors" className="rounded-lg bg-[#FFF8EE] px-3 py-1.5 text-xs font-semibold text-[#B8860B]">
                    See all
                </Link>
            </div>

            {/* Horizontal scroll on mobile, grid on desktop */}
            <div className="flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible md:pb-0 lg:grid-cols-4">
                {displayVendors.map((vendor) => (
                    <Link
                        key={vendor.id}
                        href={`/vendors/${vendor.slug}`}
                        className="group w-40 shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md md:w-auto"
                    >
                        {/* Image */}
                        <div className="relative h-28 overflow-hidden bg-gray-100">
                            <img
                                src={vendor.imageUrl}
                                alt={vendor.name}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            {/* Rating pill */}
                            <div className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-white px-1.5 py-0.5 shadow-sm">
                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                <span className="text-xs font-semibold text-gray-900">{vendor.rating.toFixed(1)}</span>
                            </div>
                            {/* Badges */}
                            {vendor.isVerified && (
                                <div className="absolute right-2 top-2">
                                    <CheckCircle className="h-4 w-4 text-blue-500 drop-shadow" />
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="p-2.5">
                            <p className="truncate text-sm font-semibold text-gray-900 group-hover:text-[#B8860B]">{vendor.name}</p>
                            <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                                <MapPin className="h-3 w-3" />
                                <span>{vendor.city}</span>
                            </div>
                            {vendor.priceRange && (
                                <p className="mt-1.5 text-sm font-bold text-[#B8860B]">{vendor.priceRange}</p>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}
