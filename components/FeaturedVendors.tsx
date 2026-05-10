import { prisma } from '@/lib/prisma'
import { Star, MapPin, CheckCircle, Zap, ArrowRight } from 'lucide-react'
import Link from 'next/link'

function safeJsonParse<T>(v: string, fb: T): T {
    try { return JSON.parse(v) as T } catch { return fb }
}

const staticVendors = [
    { id: 's1', name: 'Royal Palm Hall', slug: 'royal-palm-hall', city: 'Lahore', rating: 4.8, totalReviews: 320, priceRange: 'Rs. 450,000', imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80', isVerified: true, respondsQuickly: true, categories: [{ category: { name: 'Venue' } }] },
    { id: 's2', name: 'Dreamy Clicks Photography', slug: 'dreamy-clicks-photography', city: 'Lahore', rating: 4.9, totalReviews: 215, priceRange: 'Rs. 150,000', imageUrl: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600&q=80', isVerified: true, respondsQuickly: true, categories: [{ category: { name: 'Photography' } }] },
    { id: 's3', name: 'Glam by Sana', slug: 'glam-by-sana', city: 'Karachi', rating: 4.8, totalReviews: 189, priceRange: 'Rs. 25,000', imageUrl: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80', isVerified: false, respondsQuickly: false, categories: [{ category: { name: 'Makeup' } }] },
    { id: 's4', name: 'Zafran Catering', slug: 'zafran-catering', city: 'Lahore', rating: 4.7, totalReviews: 142, priceRange: 'Rs. 1,200/head', imageUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&q=80', isVerified: true, respondsQuickly: false, categories: [{ category: { name: 'Catering' } }] },
    { id: 's5', name: 'Floral Dreams Decor', slug: 'floral-dreams-decor', city: 'Lahore', rating: 4.8, totalReviews: 76, priceRange: 'Rs. 150,000', imageUrl: 'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=600&q=80', isVerified: true, respondsQuickly: false, categories: [{ category: { name: 'Decor' } }] },
    { id: 's6', name: 'Nadia Hussain Studio', slug: 'glam-by-sana', city: 'Karachi', rating: 4.9, totalReviews: 530, priceRange: 'Rs. 45,000', imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80', isVerified: true, respondsQuickly: true, categories: [{ category: { name: 'Makeup' } }] },
]

interface Props { title: string; subtitle?: string; filter?: 'featured' | 'top' }

export default async function FeaturedVendors({ title, subtitle, filter = 'featured' }: Props) {
    const vendors = await prisma.vendor.findMany({
        where: filter === 'featured' ? { isFeatured: true } : { rating: { gte: 4.7 } },
        take: 6,
        include: { categories: { include: { category: true } } },
        orderBy: [{ rating: 'desc' }, { totalReviews: 'desc' }],
    })

    const displayVendors = vendors.length > 0 ? vendors.map(v => ({
        id: v.id, name: v.name, slug: v.slug, city: v.city,
        rating: v.rating, totalReviews: v.totalReviews, priceRange: v.priceRange,
        imageUrl: safeJsonParse<string[]>(v.gallery, [])[0] || v.imageUrl,
        isVerified: v.isVerified, respondsQuickly: v.respondsQuickly,
        categories: v.categories,
    })) : staticVendors

    return (
        <section className="py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="mb-10 flex items-end justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">{title}</h2>
                        {subtitle && <p className="mt-2 text-gray-500">{subtitle}</p>}
                    </div>
                    <Link href="/vendors" className="hidden items-center gap-1 text-sm font-semibold text-[#B8860B] hover:text-[#D4A017] sm:flex">
                        View all <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {displayVendors.map((vendor) => (
                        <Link key={vendor.id} href={`/vendors/${vendor.slug}`}
                            className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#EBEBEB] transition-all hover:-translate-y-0.5 hover:shadow-lg hover:ring-[#B8860B]/20">
                            {/* Image */}
                            <div className="relative h-52 overflow-hidden bg-gray-100">
                                <img src={vendor.imageUrl} alt={vendor.name}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                                {/* Badges */}
                                <div className="absolute left-3 top-3 flex gap-1.5">
                                    {vendor.isVerified && (
                                        <span className="flex items-center gap-1 rounded-full bg-blue-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                                            <CheckCircle className="h-3 w-3" /> Verified
                                        </span>
                                    )}
                                    {vendor.respondsQuickly && (
                                        <span className="flex items-center gap-1 rounded-full bg-green-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
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
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <h3 className="truncate font-bold text-gray-900 transition-colors group-hover:text-[#B8860B]">
                                            {vendor.name}
                                        </h3>
                                        <p className="text-sm text-gray-500">{vendor.categories[0]?.category.name ?? 'Vendor'}</p>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1.5">
                                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                                        <span className="text-sm font-bold text-gray-900">{vendor.rating.toFixed(1)}</span>
                                    </div>
                                </div>
                                <div className="mt-3 flex items-center gap-1 text-sm text-gray-500">
                                    <MapPin className="h-3.5 w-3.5" />
                                    <span>{vendor.city}</span>
                                    <span className="mx-1 text-gray-300">·</span>
                                    <span>{vendor.totalReviews} reviews</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
