import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Star, MapPin, Phone, Mail, Globe, CheckCircle, Clock, Package, Plus } from 'lucide-react'
import Link from 'next/link'

function safeJsonParse<T>(value: string, fallback: T): T {
    try { return JSON.parse(value) as T } catch { return fallback }
}

type Ctx = { params: Promise<{ slug: string }> }

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
            _count: { select: { reviews: true, bookings: true } },
        },
    })

    if (!vendor) notFound()

    const gallery = safeJsonParse<string[]>(vendor.gallery, [])
    const features = safeJsonParse<string[]>(vendor.features, [])
    const workingHours = safeJsonParse<Record<string, string>>(vendor.workingHours ?? '{}', {})
    const images = gallery.length > 0 ? gallery : [vendor.imageUrl]

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero image strip */}
            <div className="grid h-72 grid-cols-4 gap-1 overflow-hidden md:h-96">
                <div className="col-span-2 row-span-2 overflow-hidden">
                    <img src={images[0]} alt={vendor.name} className="h-full w-full object-cover" />
                </div>
                {images.slice(1, 5).map((img, i) => (
                    <div key={i} className="overflow-hidden">
                        <img src={img} alt={`${vendor.name} ${i + 2}`} className="h-full w-full object-cover" />
                    </div>
                ))}
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col gap-8 lg:flex-row">
                    {/* Main content */}
                    <div className="flex-1 space-y-8">
                        {/* Header */}
                        <div className="rounded-2xl bg-white p-6 shadow-sm">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h1 className="text-2xl font-bold text-gray-900">{vendor.name}</h1>
                                        {vendor.isVerified && (
                                            <CheckCircle className="h-5 w-5 text-blue-500" />
                                        )}
                                    </div>
                                    <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                                        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                                            {vendor.categories[0]?.category.name ?? 'Vendor'}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MapPin className="h-3.5 w-3.5" /> {vendor.city}
                                        </span>
                                        <span>{vendor._count.bookings} bookings</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2">
                                    <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                                    <span className="text-xl font-bold text-gray-900">{vendor.rating.toFixed(1)}</span>
                                    <span className="text-sm text-gray-500">({vendor._count.reviews} reviews)</span>
                                </div>
                            </div>

                            {vendor.about && (
                                <p className="mt-4 text-gray-600 leading-relaxed">{vendor.about}</p>
                            )}

                            {features.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {features.map((f, i) => (
                                        <span key={i} className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-600">
                                            {f}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Packages */}
                        {vendor.packages.length > 0 && (
                            <div className="rounded-2xl bg-white p-6 shadow-sm">
                                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                                    <Package className="h-5 w-5 text-amber-600" /> Packages
                                </h2>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {vendor.packages.map((pkg) => {
                                        const pkgFeatures = safeJsonParse<string[]>(pkg.features, [])
                                        return (
                                            <div key={pkg.id} className={`rounded-xl border p-4 ${pkg.isPopular ? 'border-amber-400 bg-amber-50' : 'border-gray-200'}`}>
                                                {pkg.isPopular && (
                                                    <span className="mb-2 inline-block rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-semibold text-white">
                                                        Most Popular
                                                    </span>
                                                )}
                                                <h3 className="font-semibold text-gray-900">{pkg.name}</h3>
                                                <p className="mt-1 text-xl font-bold text-amber-600">{pkg.price}</p>
                                                {pkg.originalPrice && (
                                                    <p className="text-sm text-gray-400 line-through">{pkg.originalPrice}</p>
                                                )}
                                                {pkg.description && (
                                                    <p className="mt-2 text-sm text-gray-600">{pkg.description}</p>
                                                )}
                                                {pkgFeatures.length > 0 && (
                                                    <ul className="mt-3 space-y-1">
                                                        {pkgFeatures.map((f, i) => (
                                                            <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                                                <CheckCircle className="h-3.5 w-3.5 text-green-500 shrink-0" />
                                                                {f}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Add-ons */}
                        {vendor.addons.length > 0 && (
                            <div className="rounded-2xl bg-white p-6 shadow-sm">
                                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                                    <Plus className="h-5 w-5 text-amber-600" /> Add-ons
                                </h2>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {vendor.addons.map((addon) => (
                                        <div key={addon.id} className="flex items-center justify-between rounded-xl border border-gray-200 p-3">
                                            <div>
                                                <p className="font-medium text-gray-900">{addon.name}</p>
                                                {addon.description && <p className="text-sm text-gray-500">{addon.description}</p>}
                                            </div>
                                            <span className="font-semibold text-amber-600">{addon.price}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Reviews */}
                        {vendor.reviews.length > 0 && (
                            <div className="rounded-2xl bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                                    Reviews ({vendor._count.reviews})
                                </h2>
                                <div className="space-y-4">
                                    {vendor.reviews.map((review) => (
                                        <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-700">
                                                        {(review.user.name ?? 'U')[0].toUpperCase()}
                                                    </div>
                                                    <span className="font-medium text-gray-900">{review.user.name ?? 'Anonymous'}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-amber-500 text-amber-500' : 'fill-gray-200 text-gray-200'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            {review.comment && (
                                                <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
                                            )}
                                            <p className="mt-1 text-xs text-gray-400">
                                                {new Date(review.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="w-full lg:w-80 shrink-0 space-y-4">
                        {/* Contact card */}
                        <div className="rounded-2xl bg-white p-6 shadow-sm">
                            <h2 className="mb-4 font-semibold text-gray-900">Contact & Info</h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 text-amber-600 shrink-0" />
                                    <a href={`tel:${vendor.phone}`} className="text-gray-700 hover:text-amber-600">{vendor.phone}</a>
                                </div>
                                {vendor.email && (
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-4 w-4 text-amber-600 shrink-0" />
                                        <a href={`mailto:${vendor.email}`} className="text-gray-700 hover:text-amber-600">{vendor.email}</a>
                                    </div>
                                )}
                                {vendor.website && (
                                    <div className="flex items-center gap-3">
                                        <Globe className="h-4 w-4 text-amber-600 shrink-0" />
                                        <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-amber-600 truncate">{vendor.website}</a>
                                    </div>
                                )}
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                                    <span className="text-gray-700">{vendor.address || vendor.city}</span>
                                </div>
                            </div>

                            {Object.keys(workingHours).length > 0 && (
                                <div className="mt-4 border-t pt-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Clock className="h-4 w-4 text-amber-600" />
                                        <span className="text-sm font-medium text-gray-900">Working Hours</span>
                                    </div>
                                    <div className="space-y-1">
                                        {Object.entries(workingHours).map(([day, hours]) => (
                                            <div key={day} className="flex justify-between text-xs text-gray-600">
                                                <span>{day}</span>
                                                <span>{hours}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Book CTA */}
                        <div className="rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 p-6 text-white shadow-sm">
                            <h3 className="font-semibold">Ready to Book?</h3>
                            <p className="mt-1 text-sm text-amber-100">
                                {vendor.priceRange ? `Starting from ${vendor.priceRange}` : 'Contact for pricing'}
                            </p>
                            <Link
                                href={`/vendors/${vendor.slug}/book`}
                                className="mt-4 block w-full rounded-xl bg-white py-2.5 text-center text-sm font-semibold text-amber-700 hover:bg-amber-50 transition-colors"
                            >
                                Book Now
                            </Link>
                            <a
                                href={`tel:${vendor.phone}`}
                                className="mt-2 block w-full rounded-xl border border-white/40 py-2.5 text-center text-sm font-medium text-white hover:bg-white/10 transition-colors"
                            >
                                Call Vendor
                            </a>
                        </div>

                        {/* Social links */}
                        {(vendor.instagram || vendor.facebook) && (
                            <div className="rounded-2xl bg-white p-4 shadow-sm">
                                <h3 className="mb-3 text-sm font-medium text-gray-900">Social Media</h3>
                                <div className="flex gap-3">
                                    {vendor.instagram && (
                                        <a href={vendor.instagram} target="_blank" rel="noopener noreferrer"
                                            className="flex-1 rounded-lg border border-gray-200 py-2 text-center text-sm text-gray-600 hover:bg-gray-50">
                                            Instagram
                                        </a>
                                    )}
                                    {vendor.facebook && (
                                        <a href={vendor.facebook} target="_blank" rel="noopener noreferrer"
                                            className="flex-1 rounded-lg border border-gray-200 py-2 text-center text-sm text-gray-600 hover:bg-gray-50">
                                            Facebook
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </div>
        </div>
    )
}
