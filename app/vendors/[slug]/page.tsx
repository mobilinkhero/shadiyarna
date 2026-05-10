import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Star, MapPin, CheckCircle, Zap, Package, Plus, Clock, Phone, Mail, Globe } from 'lucide-react'
import Link from 'next/link'
import GalleryGrid from '@/components/GalleryGrid'
import PackageSelector from '@/components/PackageSelector'

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
        where: { id: { not: vendor.id }, categories: { some: { categoryId: vendor.categories[0]?.categoryId } } },
        take: 3,
        include: { categories: { include: { category: true } } },
    })

    const packagesData = vendor.packages.map(p => ({
        id: p.id, name: p.name, price: p.price, originalPrice: p.originalPrice,
        description: p.description, features: safeJsonParse<string[]>(p.features, []), isPopular: p.isPopular,
    }))

    return (
        <div className="min-h-screen bg-[#F8F7F4]">
            {/* Breadcrumb */}
            <div className="border-b border-[#EBEBEB] bg-white">
                <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
                    <nav className="flex items-center gap-2 text-sm text-gray-500">
                        <Link href="/" className="hover:text-[#B8860B]">Home</Link>
                        <span>/</span>
                        <Link href="/vendors" className="hover:text-[#B8860B]">Vendors</Link>
                        <span>/</span>
                        <span className="text-gray-900">{vendor.name}</span>
                    </nav>
                </div>
            </div>

            {/* Gallery */}
            <GalleryGrid images={images} vendorName={vendor.name} />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
                <div className="flex flex-col gap-8 lg:flex-row">

                    {/* ── Main content ── */}
                    <div className="flex-1 min-w-0 space-y-6">

                        {/* Header */}
                        <div className="rounded-2xl bg-white p-6 shadow-sm">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">{vendor.name}</h1>
                                        {vendor.isVerified && (
                                            <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600">
                                                <CheckCircle className="h-3.5 w-3.5" /> Verified
                                            </span>
                                        )}
                                        {vendor.respondsQuickly && (
                                            <span className="flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-600">
                                                <Zap className="h-3.5 w-3.5" /> Quick Reply
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                                        <span className="rounded-full bg-[#FFF8EE] px-3 py-0.5 text-xs font-semibold text-[#B8860B]">{categoryName}</span>
                                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{vendor.city}{vendor.address ? ` · ${vendor.address}` : ''}</span>
                                        <span>{vendor._count.bookings} bookings</span>
                                        <span>{vendor._count.wishlists} saved</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center rounded-2xl bg-amber-50 px-5 py-3 text-center">
                                    <div className="flex items-center gap-1">
                                        <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                                        <span className="text-2xl font-bold text-gray-900">{vendor.rating.toFixed(1)}</span>
                                    </div>
                                    <span className="text-xs text-gray-500">{vendor._count.reviews} reviews</span>
                                </div>
                            </div>

                            {(vendor.about || vendor.description) && (
                                <div className="mt-5 border-t border-[#EBEBEB] pt-5">
                                    <h2 className="mb-2 font-semibold text-gray-900">About</h2>
                                    <p className="leading-relaxed text-gray-600">{vendor.about || vendor.description}</p>
                                </div>
                            )}

                            {features.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {features.map((f, i) => (
                                        <span key={i} className="flex items-center gap-1.5 rounded-full border border-[#EBEBEB] bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">
                                            <CheckCircle className="h-3 w-3 text-green-500" /> {f}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {Object.keys(details).length > 0 && (
                                <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#EBEBEB] pt-5 sm:grid-cols-3">
                                    {Object.entries(details).map(([k, v]) => (
                                        <div key={k} className="rounded-xl bg-[#F8F7F4] p-3">
                                            <p className="text-xs text-gray-400">{k}</p>
                                            <p className="mt-0.5 font-semibold text-gray-800">{v}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Packages — interactive client component */}
                        {packagesData.length > 0 && (
                            <div className="rounded-2xl bg-white p-6 shadow-sm">
                                <h2 className="mb-5 flex items-center gap-2 text-xl font-bold text-gray-900">
                                    <Package className="h-5 w-5 text-[#B8860B]" /> Packages
                                </h2>
                                <PackageSelector packages={packagesData} />
                            </div>
                        )}

                        {/* Add-ons */}
                        {vendor.addons.length > 0 && (
                            <div className="rounded-2xl bg-white p-6 shadow-sm">
                                <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
                                    <Plus className="h-5 w-5 text-[#B8860B]" /> Add-ons & Extras
                                </h2>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {vendor.addons.map(addon => (
                                        <div key={addon.id} className="flex items-center justify-between rounded-xl border border-[#EBEBEB] bg-[#F8F7F4] p-4 transition-all hover:border-[#B8860B]/30">
                                            <div>
                                                <p className="font-semibold text-gray-900">{addon.name}</p>
                                                {addon.description && <p className="text-sm text-gray-500">{addon.description}</p>}
                                            </div>
                                            <span className="ml-4 shrink-0 rounded-lg bg-[#FFF8EE] px-3 py-1 text-sm font-bold text-[#B8860B]">
                                                {addon.price}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Gallery section */}
                        {images.length > 1 && (
                            <div className="rounded-2xl bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-xl font-bold text-gray-900">Gallery <span className="text-sm font-normal text-gray-400">({images.length} photos)</span></h2>
                                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                                    {images.slice(0, 8).map((img, i) => (
                                        <div key={i} className="aspect-square overflow-hidden rounded-xl bg-gray-100">
                                            <img src={img} alt={`${vendor.name} ${i + 1}`} className="h-full w-full object-cover transition-transform hover:scale-105" />
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

                            {/* Rating summary */}
                            <div className="mb-6 rounded-2xl bg-[#FFF8EE] p-5">
                                <div className="flex items-center gap-8">
                                    <div className="text-center">
                                        <p className="text-5xl font-bold text-gray-900">{vendor.rating.toFixed(1)}</p>
                                        <div className="mt-1.5 flex justify-center gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`h-4 w-4 ${i < Math.floor(vendor.rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} />
                                            ))}
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500">{vendor._count.reviews} reviews</p>
                                    </div>
                                    <div className="flex-1 space-y-1.5">
                                        {[5, 4, 3, 2, 1].map(stars => {
                                            const pct = stars === 5 ? 70 : stars === 4 ? 20 : stars === 3 ? 5 : stars === 2 ? 3 : 2
                                            return (
                                                <div key={stars} className="flex items-center gap-3">
                                                    <span className="w-4 text-right text-sm text-gray-500">{stars}</span>
                                                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                                    <div className="flex-1 overflow-hidden rounded-full bg-gray-200 h-2">
                                                        <div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${pct}%` }} />
                                                    </div>
                                                    <span className="w-8 text-xs text-gray-400">{pct}%</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>

                            {vendor.reviews.length === 0 ? (
                                <div className="rounded-xl bg-[#F8F7F4] py-12 text-center">
                                    <Star className="mx-auto mb-2 h-10 w-10 text-gray-200" />
                                    <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    {vendor.reviews.map(review => (
                                        <div key={review.id} className="flex gap-4 border-b border-[#EBEBEB] pb-5 last:border-0 last:pb-0">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#B8860B] to-[#E91E8C] text-sm font-bold text-white">
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
                                                {review.comment && <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{review.comment}</p>}
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
                                <h2 className="mb-4 text-xl font-bold text-gray-900">Similar {categoryName}</h2>
                                <div className="grid gap-4 sm:grid-cols-3">
                                    {similar.map(sv => (
                                        <Link key={sv.id} href={`/vendors/${sv.slug}`}
                                            className="group overflow-hidden rounded-xl border border-[#EBEBEB] transition-all hover:border-[#B8860B]/30 hover:shadow-md">
                                            <div className="h-36 overflow-hidden bg-gray-100">
                                                <img src={sv.imageUrl} alt={sv.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                                            </div>
                                            <div className="p-3">
                                                <p className="truncate font-semibold text-gray-900 group-hover:text-[#B8860B]">{sv.name}</p>
                                                <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                                                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                                    <span>{sv.rating.toFixed(1)}</span>
                                                    <span className="mx-1">·</span>
                                                    <MapPin className="h-3 w-3" />
                                                    <span>{sv.city}</span>
                                                </div>
                                                {sv.priceRange && <p className="mt-1 text-sm font-bold text-[#B8860B]">{sv.priceRange}</p>}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Sidebar ── */}
                    <aside className="w-full shrink-0 lg:w-80">
                        <div className="lg:sticky lg:top-20 space-y-4">

                            {/* Price + Book CTA */}
                            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#EBEBEB]">
                                <div className="bg-gradient-to-r from-[#B8860B] to-[#D4A017] p-5 text-white">
                                    <p className="text-sm font-medium text-amber-100">Starting from</p>
                                    <p className="text-3xl font-bold">{vendor.priceRange ?? 'Contact for price'}</p>
                                </div>
                                <div className="p-5 space-y-3">
                                    <Link href={`/vendors/${vendor.slug}/book`}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition-all hover:opacity-90"
                                        style={{ backgroundColor: '#E91E8C' }}>
                                        Book Now
                                    </Link>
                                    <a href={`tel:${vendor.phone}`}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#EBEBEB] py-3 text-sm font-semibold text-gray-700 transition-all hover:border-[#B8860B] hover:text-[#B8860B]">
                                        <Phone className="h-4 w-4" /> Call Vendor
                                    </a>
                                    {vendor.email && (
                                        <a href={`mailto:${vendor.email}`}
                                            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#EBEBEB] py-3 text-sm font-semibold text-gray-700 transition-all hover:border-[#B8860B] hover:text-[#B8860B]">
                                            <Mail className="h-4 w-4" /> Send Message
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Contact info */}
                            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#EBEBEB]">
                                <h3 className="mb-4 font-bold text-gray-900">Contact & Info</h3>
                                <div className="space-y-3 text-sm">
                                    {[
                                        { icon: Phone, label: 'Phone', value: vendor.phone, href: `tel:${vendor.phone}` },
                                        vendor.email ? { icon: Mail, label: 'Email', value: vendor.email, href: `mailto:${vendor.email}` } : null,
                                        vendor.website ? { icon: Globe, label: 'Website', value: vendor.website, href: vendor.website } : null,
                                        { icon: MapPin, label: 'Location', value: vendor.address || vendor.city, href: null },
                                    ].filter(Boolean).map((item) => {
                                        if (!item) return null
                                        const Icon = item.icon
                                        const content = (
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FFF8EE]">
                                                    <Icon className="h-4 w-4 text-[#B8860B]" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs text-gray-400">{item.label}</p>
                                                    <p className="truncate font-medium text-gray-900">{item.value}</p>
                                                </div>
                                            </div>
                                        )
                                        return item.href ? (
                                            <a key={item.label} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="block hover:opacity-80">
                                                {content}
                                            </a>
                                        ) : (
                                            <div key={item.label}>{content}</div>
                                        )
                                    })}
                                </div>

                                {/* Social */}
                                {(vendor.instagram || vendor.facebook) && (
                                    <div className="mt-4 flex gap-2 border-t border-[#EBEBEB] pt-4">
                                        {vendor.instagram && (
                                            <a href={vendor.instagram} target="_blank" rel="noopener noreferrer"
                                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 py-2 text-sm font-medium text-white hover:opacity-90">
                                                Instagram
                                            </a>
                                        )}
                                        {vendor.facebook && (
                                            <a href={vendor.facebook} target="_blank" rel="noopener noreferrer"
                                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700">
                                                Facebook
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Working hours */}
                            {Object.keys(workingHours).length > 0 && (
                                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#EBEBEB]">
                                    <h3 className="mb-3 flex items-center gap-2 font-bold text-gray-900">
                                        <Clock className="h-4 w-4 text-[#B8860B]" /> Working Hours
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
