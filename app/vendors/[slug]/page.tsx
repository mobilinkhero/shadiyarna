import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import {
    Star, MapPin, Phone, Mail, Globe, CheckCircle, Clock,
    Zap, Package, Plus, MessageCircle
} from 'lucide-react'
import Link from 'next/link'
import BookingForm from '@/components/BookingForm'
import GalleryGrid from '@/components/GalleryGrid'

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

    // Similar vendors
    const similar = await prisma.vendor.findMany({
        where: {
            id: { not: vendor.id },
            categories: { some: { categoryId: vendor.categories[0]?.categoryId } },
        },
        take: 3,
        include: { categories: { include: { category: true } } },
    })

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="border-b bg-white">
                <div className="container mx-auto flex items-center gap-2 px-4 py-3 text-sm text-gray-500">
                    <Link href="/" className="hover:text-amber-600">Home</Link>
                    <span>/</span>
                    <Link href="/vendors" className="hover:text-amber-600">Vendors</Link>
                    <span>/</span>
                    <span className="text-gray-900">{vendor.name}</span>
                </div>
            </div>

            {/* Gallery */}
            <GalleryGrid images={images} vendorName={vendor.name} />

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col gap-8 lg:flex-row">
                    {/* ── Main content ── */}
                    <div className="flex-1 min-w-0 space-y-6">

                        {/* Header card */}
                        <div className="rounded-2xl bg-white p-6 shadow-sm">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">{vendor.name}</h1>
                                        {vendor.isVerified && (
                                            <span className="flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                                                <CheckCircle className="h-3.5 w-3.5" /> Verified
                                            </span>
                                        )}
                                        {vendor.respondsQuickly && (
                                            <span className="flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                                                <Zap className="h-3.5 w-3.5" /> Quick Reply
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                                        <span className="rounded-full bg-amber-100 px-3 py-0.5 text-xs font-semibold text-amber-800">
                                            {categoryName}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MapPin className="h-3.5 w-3.5" /> {vendor.city}
                                            {vendor.address && ` · ${vendor.address}`}
                                        </span>
                                        <span>{vendor._count.bookings} bookings</span>
                                        <span>{vendor._count.wishlists} saved</span>
                                    </div>
                                </div>

                                {/* Rating */}
                                <div className="flex flex-col items-center rounded-2xl bg-amber-50 px-5 py-3 text-center">
                                    <div className="flex items-center gap-1">
                                        <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                                        <span className="text-2xl font-bold text-gray-900">{vendor.rating.toFixed(1)}</span>
                                    </div>
                                    <span className="text-xs text-gray-500">{vendor._count.reviews} reviews</span>
                                </div>
                            </div>

                            {/* About */}
                            {(vendor.about || vendor.description) && (
                                <div className="mt-5 border-t pt-5">
                                    <h2 className="mb-2 font-semibold text-gray-900">About</h2>
                                    <p className="leading-relaxed text-gray-600">{vendor.about || vendor.description}</p>
                                </div>
                            )}

                            {/* Features */}
                            {features.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {features.map((f, i) => (
                                        <span key={i} className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">
                                            <CheckCircle className="h-3 w-3 text-green-500" /> {f}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Details grid */}
                            {Object.keys(details).length > 0 && (
                                <div className="mt-5 grid grid-cols-2 gap-3 border-t pt-5 sm:grid-cols-3">
                                    {Object.entries(details).map(([key, val]) => (
                                        <div key={key} className="rounded-xl bg-gray-50 p-3">
                                            <p className="text-xs text-gray-400">{key}</p>
                                            <p className="mt-0.5 font-semibold text-gray-800">{val}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Packages */}
                        {vendor.packages.length > 0 && (
                            <div className="rounded-2xl bg-white p-6 shadow-sm">
                                <h2 className="mb-5 flex items-center gap-2 text-xl font-bold text-gray-900">
                                    <Package className="h-5 w-5 text-amber-600" /> Packages
                                </h2>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {vendor.packages.map((pkg) => {
                                        const pkgFeatures = safeJsonParse<string[]>(pkg.features, [])
                                        return (
                                            <div key={pkg.id} className={`relative overflow-hidden rounded-2xl border-2 p-5 transition-all hover:shadow-md ${pkg.isPopular ? 'border-amber-400 bg-gradient-to-br from-amber-50 to-orange-50' : 'border-gray-100 bg-gray-50'}`}>
                                                {pkg.isPopular && (
                                                    <div className="absolute right-0 top-0 rounded-bl-xl bg-amber-500 px-3 py-1 text-xs font-bold text-white">
                                                        Most Popular
                                                    </div>
                                                )}
                                                <h3 className="text-lg font-bold text-gray-900">{pkg.name}</h3>
                                                <div className="mt-1 flex items-baseline gap-2">
                                                    <span className="text-2xl font-bold text-amber-600">{pkg.price}</span>
                                                    {pkg.originalPrice && (
                                                        <span className="text-sm text-gray-400 line-through">{pkg.originalPrice}</span>
                                                    )}
                                                </div>
                                                {pkg.description && (
                                                    <p className="mt-2 text-sm text-gray-600">{pkg.description}</p>
                                                )}
                                                {pkgFeatures.length > 0 && (
                                                    <ul className="mt-3 space-y-1.5">
                                                        {pkgFeatures.map((f, i) => (
                                                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                                                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
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
                                <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
                                    <Plus className="h-5 w-5 text-amber-600" /> Add-ons
                                </h2>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {vendor.addons.map((addon) => (
                                        <div key={addon.id} className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4 transition-all hover:border-amber-200 hover:bg-amber-50">
                                            <div>
                                                <p className="font-semibold text-gray-900">{addon.name}</p>
                                                {addon.description && <p className="text-sm text-gray-500">{addon.description}</p>}
                                            </div>
                                            <span className="ml-4 shrink-0 rounded-lg bg-amber-100 px-3 py-1 text-sm font-bold text-amber-700">
                                                {addon.price}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Reviews */}
                        <div className="rounded-2xl bg-white p-6 shadow-sm">
                            <h2 className="mb-5 text-xl font-bold text-gray-900">
                                Reviews <span className="text-gray-400">({vendor._count.reviews})</span>
                            </h2>
                            {vendor.reviews.length === 0 ? (
                                <div className="rounded-xl bg-gray-50 py-10 text-center">
                                    <Star className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                                    <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    {vendor.reviews.map((review) => (
                                        <div key={review.id} className="flex gap-4 border-b border-gray-50 pb-5 last:border-0 last:pb-0">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-rose-400 text-sm font-bold text-white">
                                                {(review.user.name ?? 'U')[0].toUpperCase()}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-center justify-between gap-2">
                                                    <span className="font-semibold text-gray-900">{review.user.name ?? 'Anonymous'}</span>
                                                    <div className="flex items-center gap-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} />
                                                        ))}
                                                    </div>
                                                </div>
                                                {review.comment && (
                                                    <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{review.comment}</p>
                                                )}
                                                <p className="mt-1 text-xs text-gray-400">
                                                    {new Date(review.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Similar vendors */}
                        {similar.length > 0 && (
                            <div className="rounded-2xl bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-xl font-bold text-gray-900">Similar Vendors</h2>
                                <div className="grid gap-4 sm:grid-cols-3">
                                    {similar.map(sv => (
                                        <Link key={sv.id} href={`/vendors/${sv.slug}`} className="group overflow-hidden rounded-xl border border-gray-100 transition-all hover:border-amber-200 hover:shadow-md">
                                            <div className="h-32 overflow-hidden bg-gray-100">
                                                <img src={sv.imageUrl} alt={sv.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                                            </div>
                                            <div className="p-3">
                                                <p className="truncate font-semibold text-gray-900 group-hover:text-amber-600">{sv.name}</p>
                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                    <MapPin className="h-3 w-3" /> {sv.city}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Sidebar ── */}
                    <aside className="w-full shrink-0 space-y-4 lg:w-80">
                        {/* Sticky wrapper */}
                        <div className="lg:sticky lg:top-20 space-y-4">
                            {/* Price + Book CTA */}
                            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
                                <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-5 text-white">
                                    <p className="text-sm font-medium text-amber-100">Starting from</p>
                                    <p className="text-3xl font-bold">{vendor.priceRange ?? 'Contact for price'}</p>
                                </div>
                                <div className="p-5 space-y-3">
                                    <BookingForm vendorId={vendor.id} vendorName={vendor.name} vendorSlug={vendor.slug} />
                                    <a
                                        href={`tel:${vendor.phone}`}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-gray-200 py-3 text-sm font-semibold text-gray-700 transition-all hover:border-amber-400 hover:text-amber-600"
                                    >
                                        <Phone className="h-4 w-4" /> Call Vendor
                                    </a>
                                    {vendor.email && (
                                        <a
                                            href={`mailto:${vendor.email}`}
                                            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-gray-200 py-3 text-sm font-semibold text-gray-700 transition-all hover:border-amber-400 hover:text-amber-600"
                                        >
                                            <MessageCircle className="h-4 w-4" /> Send Message
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Contact info */}
                            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
                                <h3 className="mb-4 font-bold text-gray-900">Contact & Info</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                                            <Phone className="h-4 w-4 text-amber-600" />
                                        </div>
                                        <a href={`tel:${vendor.phone}`} className="text-gray-700 hover:text-amber-600">{vendor.phone}</a>
                                    </div>
                                    {vendor.email && (
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                                                <Mail className="h-4 w-4 text-amber-600" />
                                            </div>
                                            <a href={`mailto:${vendor.email}`} className="truncate text-gray-700 hover:text-amber-600">{vendor.email}</a>
                                        </div>
                                    )}
                                    {vendor.website && (
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                                                <Globe className="h-4 w-4 text-amber-600" />
                                            </div>
                                            <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="truncate text-gray-700 hover:text-amber-600">{vendor.website}</a>
                                        </div>
                                    )}
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                                            <MapPin className="h-4 w-4 text-amber-600" />
                                        </div>
                                        <span className="text-gray-700">{vendor.address || vendor.city}</span>
                                    </div>
                                </div>

                                {/* Social */}
                                {(vendor.instagram || vendor.facebook) && (
                                    <div className="mt-4 flex gap-2 border-t pt-4">
                                        {vendor.instagram && (
                                            <a href={vendor.instagram} target="_blank" rel="noopener noreferrer"
                                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 py-2 text-sm font-medium text-white hover:opacity-90">
                                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                                                Instagram
                                            </a>
                                        )}
                                        {vendor.facebook && (
                                            <a href={vendor.facebook} target="_blank" rel="noopener noreferrer"
                                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700">
                                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                                Facebook
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Working hours */}
                            {Object.keys(workingHours).length > 0 && (
                                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
                                    <h3 className="mb-3 flex items-center gap-2 font-bold text-gray-900">
                                        <Clock className="h-4 w-4 text-amber-600" /> Working Hours
                                    </h3>
                                    <div className="space-y-2">
                                        {Object.entries(workingHours).map(([day, hours]) => (
                                            <div key={day} className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">{day}</span>
                                                <span className="font-medium text-gray-800">{hours}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}
