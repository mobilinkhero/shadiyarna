'use client'

import { useState, useEffect, useRef } from 'react'
import {
    Star, MapPin, Phone, Mail, Globe, CheckCircle, Clock,
    Zap, Package, Plus, Share2, ChevronDown, ChevronUp, Award,
    Calendar, Loader2, X, ChevronLeft, ChevronRight, Heart
} from 'lucide-react'
import Link from 'next/link'

interface Package {
    id: string; name: string; price: string; originalPrice?: string | null
    description?: string | null; features: string[]; isPopular: boolean
}
interface Addon { id: string; name: string; price: string; description?: string | null }
interface Review {
    id: string; rating: number; comment?: string | null; images: string[]
    userName: string; userAvatar?: string | null; createdAt: string
}
interface SimilarVendor {
    id: string; name: string; slug: string; city: string; rating: number
    imageUrl: string; priceRange?: string | null; categoryName: string
}

interface VendorData {
    id: string; name: string; slug: string; city: string; address?: string | null
    phone: string; email?: string | null; website?: string | null
    instagram?: string | null; facebook?: string | null
    rating: number; totalReviews: number; priceRange?: string | null
    minPrice?: number | null; maxPrice?: number | null
    isVerified: boolean; respondsQuickly: boolean
    about?: string | null; description?: string | null
    features: string[]; details: Record<string, string>; workingHours: Record<string, string>
    images: string[]; categoryName: string; categorySlug: string
    bookings: number; wishlists: number
    packages: Package[]; addons: Addon[]; reviews: Review[]; similar: SimilarVendor[]
}

const tabSections = [
    { id: 'details', label: 'Details' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'faq', label: 'FAQ' },
    { id: 'location', label: 'Location' },
]

export default function VendorDetailClient({ vendor }: { vendor: VendorData }) {
    const [activeTab, setActiveTab] = useState('details')
    const [selectedPkg, setSelectedPkg] = useState<Package | null>(vendor.packages[0] ?? null)
    const [expandedPkg, setExpandedPkg] = useState<string | null>(null)
    const [lightbox, setLightbox] = useState<number | null>(null)
    const [showBookingModal, setShowBookingModal] = useState(false)
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

    const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

    // Scroll spy — highlight tab as user scrolls
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(e => {
                    if (e.isIntersecting) setActiveTab(e.target.id)
                })
            },
            { rootMargin: '-120px 0px -60% 0px', threshold: 0 }
        )
        Object.values(sectionRefs.current).forEach(el => el && observer.observe(el))
        return () => observer.disconnect()
    }, [])

    function scrollToSection(id: string) {
        const el = sectionRefs.current[id]
        if (el) {
            const y = el.getBoundingClientRect().top + window.scrollY - 130
            window.scrollTo({ top: y, behavior: 'smooth' })
        }
    }

    // FAQ data — based on vendor category
    const faqs = [
        { q: 'What is the cancellation policy?', a: 'Cancellations made 30+ days before the event receive a full refund. 15-29 days: 50% refund. Less than 15 days: non-refundable. Please contact the vendor directly for specific terms.' },
        { q: 'What amenities are included?', a: vendor.features.length > 0 ? vendor.features.join(', ') : 'Contact the vendor for a detailed list of included amenities and services.' },
        { q: `How do I book ${vendor.name}?`, a: 'Click "Book Now" to select your event date and send a booking request. The vendor will confirm availability within 24 hours and contact you to finalize details.' },
        { q: 'Is a deposit required?', a: 'Yes, typically a 20-30% deposit is required to confirm your booking. The vendor will share exact terms after you send a booking request.' },
        { q: 'Can I customize the package?', a: 'Yes. All packages are customizable. Contact the vendor after booking to discuss your specific requirements.' },
        { q: 'Do you offer discounts for early bookings?', a: 'Many vendors offer early-bird discounts for bookings made 6+ months in advance. Check the deals section or ask the vendor directly.' },
    ]

    return (
        <div className="min-h-screen bg-[#F8F7F4]">
            {/* Breadcrumb */}
            <div className="border-b border-[#EBEBEB] bg-white">
                <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
                    <nav className="flex items-center gap-2 text-sm text-gray-500">
                        <Link href="/" className="hover:text-[#B8860B]">Home</Link>
                        <span>/</span>
                        <Link href="/vendors" className="hover:text-[#B8860B]">Vendors</Link>
                        {vendor.categorySlug && (
                            <>
                                <span>/</span>
                                <Link href={`/vendors?category=${vendor.categorySlug}`} className="hover:text-[#B8860B]">{vendor.categoryName}</Link>
                            </>
                        )}
                        <span>/</span>
                        <span className="text-gray-900 font-medium">{vendor.name}</span>
                    </nav>
                </div>
            </div>

            {/* Gallery mosaic */}
            <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
                <div className="grid h-64 grid-cols-4 gap-2 overflow-hidden rounded-2xl md:h-96">
                    <div className="col-span-4 row-span-2 cursor-pointer overflow-hidden md:col-span-2" onClick={() => setLightbox(0)}>
                        <img src={vendor.images[0]} alt={vendor.name} className="h-full w-full object-cover transition-transform hover:scale-105" />
                    </div>
                    {vendor.images.slice(1, 5).map((img, i) => (
                        <div key={i} className="hidden cursor-pointer overflow-hidden md:block" onClick={() => setLightbox(i + 1)}>
                            <img src={img} alt={`${vendor.name} ${i + 2}`} className="h-full w-full object-cover transition-transform hover:scale-105" />
                            {i === 3 && vendor.images.length > 5 && (
                                <div className="pointer-events-none relative -mt-full flex h-full w-full items-center justify-center bg-black/50 text-white font-semibold">
                                    +{vendor.images.length - 5} photos
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Header info */}
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
                <div className="flex flex-wrap items-start justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm">
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{vendor.name}</h1>
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
                            <span className="rounded-full bg-[#FFF8EE] px-3 py-0.5 text-xs font-semibold text-[#B8860B]">{vendor.categoryName}</span>
                            <span className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                {vendor.city}{vendor.address ? ` · ${vendor.address}` : ''}
                            </span>
                            {/* Only show stats if they exist */}
                            {vendor.bookings > 0 && <span>{vendor.bookings} bookings</span>}
                            {vendor.wishlists > 0 && <span>{vendor.wishlists} saved</span>}
                        </div>

                        {/* Rating — only show if there are reviews */}
                        {vendor.totalReviews > 0 ? (
                            <div className="mt-3 flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                                    <span className="text-xl font-bold text-gray-900">{vendor.rating.toFixed(1)}</span>
                                </div>
                                <span className="text-sm text-gray-500">({vendor.totalReviews} reviews)</span>
                            </div>
                        ) : (
                            <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                                <Star className="h-4 w-4 text-gray-300" />
                                <span>New on Shadiyarana · Be the first to review</span>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 rounded-xl border border-[#EBEBEB] px-4 py-2.5 text-sm font-medium text-gray-600 hover:border-[#B8860B] hover:text-[#B8860B] transition-colors">
                            <Heart className="h-4 w-4" /> Save
                        </button>
                        <button className="flex items-center gap-2 rounded-xl border border-[#EBEBEB] px-4 py-2.5 text-sm font-medium text-gray-600 hover:border-[#B8860B] hover:text-[#B8860B] transition-colors">
                            <Share2 className="h-4 w-4" /> Share
                        </button>
                    </div>
                </div>
            </div>

            {/* Sticky tab bar */}
            <div className="sticky top-16 z-30 border-b border-[#EBEBEB] bg-white/95 backdrop-blur">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="flex gap-1 overflow-x-auto">
                        {tabSections.map(tab => {
                            // Only show relevant tabs
                            if (tab.id === 'faq' && faqs.length === 0) return null
                            if (tab.id === 'pricing' && vendor.packages.length === 0 && vendor.addons.length === 0) return null
                            return (
                                <button key={tab.id} onClick={() => scrollToSection(tab.id)}
                                    className={`shrink-0 border-b-2 px-5 py-4 text-sm font-semibold transition-colors ${
                                        activeTab === tab.id
                                            ? 'border-[#B8860B] text-[#B8860B]'
                                            : 'border-transparent text-gray-500 hover:text-gray-800'
                                    }`}>
                                    {tab.label}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Main content + sidebar */}
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
                <div className="flex flex-col gap-8 lg:flex-row">

                    {/* Main column */}
                    <div className="min-w-0 flex-1 space-y-8">

                        {/* Details section */}
                        <section id="details" ref={el => { sectionRefs.current.details = el }} className="rounded-2xl bg-white p-6 shadow-sm scroll-mt-32">
                            {(vendor.about || vendor.description) && (
                                <>
                                    <h2 className="text-xl font-bold text-gray-900">About {vendor.name}</h2>
                                    <p className="mt-3 leading-relaxed text-gray-600">{vendor.about || vendor.description}</p>
                                </>
                            )}

                            {vendor.features.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="mb-3 font-semibold text-gray-900">What&apos;s Included</h3>
                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                        {vendor.features.map((f, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                                <CheckCircle className="h-4 w-4 shrink-0 text-green-500" /> {f}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {Object.keys(vendor.details).length > 0 && (
                                <div className="mt-6 grid grid-cols-2 gap-3 border-t border-[#EBEBEB] pt-6 sm:grid-cols-3">
                                    {Object.entries(vendor.details).map(([k, v]) => (
                                        <div key={k} className="rounded-xl bg-[#F8F7F4] p-3">
                                            <p className="text-xs text-gray-400 uppercase tracking-wide">{k}</p>
                                            <p className="mt-1 font-semibold text-gray-800">{v}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Trust signals */}
                            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-[#EBEBEB] pt-6">
                                <div className="text-center">
                                    <Award className="mx-auto mb-1 h-5 w-5 text-[#B8860B]" />
                                    <p className="text-xs text-gray-500">Verified</p>
                                    <p className="text-sm font-semibold text-gray-900">{vendor.isVerified ? 'Yes' : 'Pending'}</p>
                                </div>
                                <div className="text-center">
                                    <Zap className="mx-auto mb-1 h-5 w-5 text-[#B8860B]" />
                                    <p className="text-xs text-gray-500">Response</p>
                                    <p className="text-sm font-semibold text-gray-900">{vendor.respondsQuickly ? 'Within 1 hr' : 'Within 24 hrs'}</p>
                                </div>
                                <div className="text-center">
                                    <Calendar className="mx-auto mb-1 h-5 w-5 text-[#B8860B]" />
                                    <p className="text-xs text-gray-500">Bookings</p>
                                    <p className="text-sm font-semibold text-gray-900">{vendor.bookings > 0 ? `${vendor.bookings}+` : 'New'}</p>
                                </div>
                            </div>
                        </section>

                        {/* Pricing section */}
                        {(vendor.packages.length > 0 || vendor.addons.length > 0) && (
                            <section id="pricing" ref={el => { sectionRefs.current.pricing = el }} className="scroll-mt-32">
                                {vendor.packages.length > 0 && (
                                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                                        <div className="flex items-center justify-between mb-5">
                                            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                                                <Package className="h-5 w-5 text-[#B8860B]" /> Packages
                                            </h2>
                                            <span className="text-sm text-gray-500">{vendor.packages.length} options</span>
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                            {vendor.packages.map((pkg, idx) => {
                                                const isSelected = selectedPkg?.id === pkg.id
                                                const isExpanded = expandedPkg === pkg.id
                                                return (
                                                    <div key={pkg.id}
                                                        className={`relative overflow-hidden rounded-2xl border-2 p-5 transition-all ${
                                                            isSelected ? 'border-[#B8860B] bg-[#FFF8EE]' : 'border-[#EBEBEB] bg-white hover:border-[#B8860B]/40'
                                                        }`}>
                                                        {pkg.isPopular && (
                                                            <div className="absolute right-0 top-0 rounded-bl-xl bg-[#B8860B] px-3 py-1 text-xs font-bold text-white">
                                                                POPULAR
                                                            </div>
                                                        )}
                                                        <h3 className="font-bold text-gray-900">{pkg.name}</h3>
                                                        <div className="mt-2 flex items-baseline gap-2">
                                                            <span className="text-2xl font-bold text-[#E91E8C]">{pkg.price}</span>
                                                            {pkg.originalPrice && (
                                                                <span className="text-sm text-gray-400 line-through">{pkg.originalPrice}</span>
                                                            )}
                                                        </div>
                                                        {pkg.description && (
                                                            <p className="mt-2 text-sm text-gray-600">{pkg.description}</p>
                                                        )}

                                                        {pkg.features.length > 0 && (
                                                            <div className="mt-3">
                                                                <ul className={`space-y-1.5 ${!isExpanded && pkg.features.length > 3 ? 'max-h-24 overflow-hidden' : ''}`}>
                                                                    {pkg.features.slice(0, isExpanded ? undefined : 3).map((f, i) => (
                                                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                                                            <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-500" />
                                                                            {f}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                                {pkg.features.length > 3 && (
                                                                    <button onClick={() => setExpandedPkg(isExpanded ? null : pkg.id)}
                                                                        className="mt-2 text-xs font-medium text-[#B8860B] hover:underline">
                                                                        {isExpanded ? 'Show less' : `+ ${pkg.features.length - 3} more`}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}

                                                        <button onClick={() => setSelectedPkg(pkg)}
                                                            className={`mt-4 w-full rounded-xl py-2 text-sm font-semibold transition-all ${
                                                                isSelected
                                                                    ? 'bg-[#B8860B] text-white'
                                                                    : 'border border-[#B8860B] text-[#B8860B] hover:bg-[#FFF8EE]'
                                                            }`}>
                                                            {isSelected ? '✓ Selected' : 'Select'}
                                                        </button>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                                {vendor.addons.length > 0 && (
                                    <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
                                        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
                                            <Plus className="h-5 w-5 text-[#B8860B]" /> Add-ons & Extras
                                        </h2>
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            {vendor.addons.map(addon => (
                                                <div key={addon.id} className="flex items-center justify-between rounded-xl border border-[#EBEBEB] bg-[#F8F7F4] p-4">
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-gray-900">{addon.name}</p>
                                                        {addon.description && <p className="truncate text-sm text-gray-500">{addon.description}</p>}
                                                    </div>
                                                    <span className="ml-4 shrink-0 rounded-lg bg-[#FFF8EE] px-3 py-1 text-sm font-bold text-[#B8860B]">{addon.price}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </section>
                        )}

                        {/* Gallery section */}
                        <section id="gallery" ref={el => { sectionRefs.current.gallery = el }} className="rounded-2xl bg-white p-6 shadow-sm scroll-mt-32">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">Gallery</h2>
                                <span className="text-sm text-gray-500">{vendor.images.length} photos</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                                {vendor.images.map((img, i) => (
                                    <div key={i} className="aspect-square cursor-pointer overflow-hidden rounded-xl bg-gray-100" onClick={() => setLightbox(i)}>
                                        <img src={img} alt={`${vendor.name} ${i + 1}`}
                                            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" />
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Reviews section */}
                        <section id="reviews" ref={el => { sectionRefs.current.reviews = el }} className="rounded-2xl bg-white p-6 shadow-sm scroll-mt-32">
                            <h2 className="mb-4 text-xl font-bold text-gray-900">
                                Reviews {vendor.totalReviews > 0 && <span className="text-gray-400">({vendor.totalReviews})</span>}
                            </h2>

                            {vendor.totalReviews > 0 ? (
                                <>
                                    {/* Rating summary */}
                                    <div className="mb-6 rounded-2xl bg-[#FFF8EE] p-5">
                                        <div className="flex items-center gap-8">
                                            <div className="text-center">
                                                <p className="text-5xl font-bold text-gray-900">{vendor.rating.toFixed(1)}</p>
                                                <div className="mt-1 flex justify-center gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`h-4 w-4 ${i < Math.floor(vendor.rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} />
                                                    ))}
                                                </div>
                                                <p className="mt-1 text-sm text-gray-500">{vendor.totalReviews} reviews</p>
                                            </div>
                                            <div className="flex-1 space-y-1.5">
                                                {[5, 4, 3, 2, 1].map(stars => {
                                                    const pct = stars === 5 ? 70 : stars === 4 ? 20 : stars === 3 ? 5 : stars === 2 ? 3 : 2
                                                    return (
                                                        <div key={stars} className="flex items-center gap-3">
                                                            <span className="w-3 text-right text-sm text-gray-500">{stars}</span>
                                                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                                            <div className="flex-1 overflow-hidden rounded-full bg-gray-200 h-2">
                                                                <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                                                            </div>
                                                            <span className="w-8 text-xs text-gray-400">{pct}%</span>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-5">
                                        {vendor.reviews.map(review => (
                                            <div key={review.id} className="flex gap-4 border-b border-[#EBEBEB] pb-5 last:border-0 last:pb-0">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#B8860B] to-[#E91E8C] text-sm font-bold text-white">
                                                    {review.userName[0].toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                                        <span className="font-semibold text-gray-900">{review.userName}</span>
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
                                </>
                            ) : (
                                <div className="rounded-xl border border-dashed border-[#EBEBEB] bg-[#F8F7F4] py-12 text-center">
                                    <Star className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                                    <p className="font-medium text-gray-700">No reviews yet</p>
                                    <p className="mt-1 text-sm text-gray-500">Book {vendor.name} and be the first to share your experience</p>
                                </div>
                            )}
                        </section>

                        {/* FAQ section */}
                        <section id="faq" ref={el => { sectionRefs.current.faq = el }} className="rounded-2xl bg-white p-6 shadow-sm scroll-mt-32">
                            <h2 className="mb-4 text-xl font-bold text-gray-900">Frequently Asked Questions</h2>
                            <div className="space-y-2">
                                {faqs.map((faq, i) => {
                                    const open = expandedFaq === i
                                    return (
                                        <div key={i} className="overflow-hidden rounded-xl border border-[#EBEBEB] bg-[#F8F7F4]">
                                            <button onClick={() => setExpandedFaq(open ? null : i)}
                                                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left">
                                                <span className="font-medium text-gray-900">{faq.q}</span>
                                                {open
                                                    ? <ChevronUp className="h-5 w-5 shrink-0 text-[#B8860B]" />
                                                    : <ChevronDown className="h-5 w-5 shrink-0 text-gray-400" />}
                                            </button>
                                            {open && (
                                                <div className="border-t border-[#EBEBEB] bg-white px-5 py-4">
                                                    <p className="text-sm leading-relaxed text-gray-600">{faq.a}</p>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </section>

                        {/* Location section */}
                        <section id="location" ref={el => { sectionRefs.current.location = el }} className="rounded-2xl bg-white p-6 shadow-sm scroll-mt-32">
                            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
                                <MapPin className="h-5 w-5 text-[#B8860B]" /> Location
                            </h2>
                            <p className="mb-4 text-gray-600">{vendor.address || vendor.city}</p>

                            <div className="overflow-hidden rounded-xl border border-[#EBEBEB]">
                                <iframe
                                    src={`https://www.google.com/maps?q=${encodeURIComponent(`${vendor.address ?? ''} ${vendor.city} Pakistan`)}&output=embed`}
                                    width="100%"
                                    height="320"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>
                        </section>

                        {/* Similar vendors */}
                        {vendor.similar.length > 0 && (
                            <section className="rounded-2xl bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-xl font-bold text-gray-900">Similar {vendor.categoryName}</h2>
                                <div className="grid gap-4 sm:grid-cols-3">
                                    {vendor.similar.map(sv => (
                                        <Link key={sv.id} href={`/vendors/${sv.slug}`}
                                            className="group overflow-hidden rounded-xl border border-[#EBEBEB] transition-all hover:border-[#B8860B]/30 hover:shadow-md">
                                            <div className="h-36 overflow-hidden bg-gray-100">
                                                <img src={sv.imageUrl} alt={sv.name}
                                                    className="h-full w-full object-cover transition-transform group-hover:scale-105" />
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
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="w-full shrink-0 lg:w-80">
                        <div className="lg:sticky lg:top-36 space-y-4">

                            {/* Booking card */}
                            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#EBEBEB]">
                                <div className="bg-gradient-to-r from-[#B8860B] to-[#D4A017] p-5 text-white">
                                    <p className="text-sm font-medium text-amber-100">
                                        {selectedPkg ? `Selected: ${selectedPkg.name}` : 'Starting from'}
                                    </p>
                                    <p className="text-3xl font-bold">
                                        {selectedPkg?.price ?? vendor.priceRange ?? 'Contact'}
                                    </p>
                                </div>
                                <div className="space-y-3 p-5">
                                    <button onClick={() => setShowBookingModal(true)}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition-all hover:opacity-90"
                                        style={{ backgroundColor: '#E91E8C' }}>
                                        Book Now
                                    </button>
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
                                    <a href={`tel:${vendor.phone}`} className="flex items-center gap-3 hover:opacity-80">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FFF8EE]">
                                            <Phone className="h-4 w-4 text-[#B8860B]" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs text-gray-400">Phone</p>
                                            <p className="truncate font-medium text-gray-900">{vendor.phone}</p>
                                        </div>
                                    </a>
                                    {vendor.email && (
                                        <a href={`mailto:${vendor.email}`} className="flex items-center gap-3 hover:opacity-80">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FFF8EE]">
                                                <Mail className="h-4 w-4 text-[#B8860B]" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs text-gray-400">Email</p>
                                                <p className="truncate font-medium text-gray-900">{vendor.email}</p>
                                            </div>
                                        </a>
                                    )}
                                    {vendor.website && (
                                        <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:opacity-80">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FFF8EE]">
                                                <Globe className="h-4 w-4 text-[#B8860B]" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs text-gray-400">Website</p>
                                                <p className="truncate font-medium text-gray-900">{vendor.website}</p>
                                            </div>
                                        </a>
                                    )}
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FFF8EE]">
                                            <MapPin className="h-4 w-4 text-[#B8860B]" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400">Location</p>
                                            <p className="font-medium text-gray-900">{vendor.address || vendor.city}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Working hours */}
                            {Object.keys(vendor.workingHours).length > 0 && (
                                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#EBEBEB]">
                                    <h3 className="mb-3 flex items-center gap-2 font-bold text-gray-900">
                                        <Clock className="h-4 w-4 text-[#B8860B]" /> Working Hours
                                    </h3>
                                    <div className="space-y-2">
                                        {Object.entries(vendor.workingHours).map(([day, hours]) => (
                                            <div key={day} className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">{day}</span>
                                                <span className="font-medium text-gray-900">{hours}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            </div>

            {/* Lightbox */}
            {lightbox !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95" onClick={() => setLightbox(null)}>
                    <button onClick={() => setLightbox(null)} className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20">
                        <X className="h-6 w-6" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setLightbox(i => i !== null ? (i - 1 + vendor.images.length) % vendor.images.length : null) }}
                        className="absolute left-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20">
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <img src={vendor.images[lightbox]} alt="" className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain" onClick={e => e.stopPropagation()} />
                    <button onClick={(e) => { e.stopPropagation(); setLightbox(i => i !== null ? (i + 1) % vendor.images.length : null) }}
                        className="absolute right-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20">
                        <ChevronRight className="h-6 w-6" />
                    </button>
                    <div className="absolute bottom-4 text-sm text-gray-400">{lightbox + 1} / {vendor.images.length}</div>
                </div>
            )}

            {/* Booking modal */}
            {showBookingModal && (
                <BookingModal vendor={vendor} selectedPkg={selectedPkg} onClose={() => setShowBookingModal(false)} />
            )}

            {/* Floating call button */}
            <a href={`tel:${vendor.phone}`}
                className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#E91E8C] text-white shadow-xl hover:scale-110 transition-transform"
                title="Call vendor">
                <Phone className="h-6 w-6" />
            </a>
        </div>
    )
}

// ── Booking Modal ──────────────────────────────────────────────────────────
function BookingModal({ vendor, selectedPkg, onClose }: { vendor: VendorData; selectedPkg: Package | null; onClose: () => void }) {
    const [date, setDate] = useState('')
    const [timeSlot, setTimeSlot] = useState('Evening')
    const [guests, setGuests] = useState('')
    const [notes, setNotes] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    async function submit() {
        if (!date) { setError('Please select an event date'); return }
        setLoading(true); setError('')
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
            if (!token) {
                window.location.href = `/login?redirect=/vendors/${vendor.slug}`
                return
            }
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    vendorId: vendor.id,
                    packageId: selectedPkg?.id,
                    date,
                    guests: guests || undefined,
                    notes: `Time slot: ${timeSlot}${notes ? `. ${notes}` : ''}`,
                }),
            })
            const json = await res.json()
            if (!res.ok) throw new Error(json.error || 'Booking failed')
            setSuccess(true)
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Something went wrong')
        } finally { setLoading(false) }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between bg-gradient-to-r from-[#B8860B] to-[#D4A017] p-5 text-white">
                    <div>
                        <p className="text-sm text-amber-100">Booking Request</p>
                        <p className="text-lg font-bold">{vendor.name}</p>
                    </div>
                    <button onClick={onClose} className="rounded-full bg-white/20 p-1.5 hover:bg-white/30">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {success ? (
                    <div className="p-8 text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                            <CheckCircle className="h-8 w-8 text-green-500" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Booking Request Sent!</h3>
                        <p className="mt-2 text-sm text-gray-600">The vendor will contact you within 24 hours to confirm details.</p>
                        <button onClick={onClose} className="mt-6 w-full rounded-xl bg-[#B8860B] py-3 font-semibold text-white hover:bg-[#D4A017]">
                            Done
                        </button>
                    </div>
                ) : (
                    <div className="p-5 space-y-4">
                        {selectedPkg && (
                            <div className="rounded-xl bg-[#FFF8EE] p-3">
                                <p className="text-xs text-gray-500">Selected Package</p>
                                <p className="font-semibold text-[#B8860B]">{selectedPkg.name} — {selectedPkg.price}</p>
                            </div>
                        )}

                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-gray-700">Event Date *</label>
                            <input type="date" value={date} onChange={e => setDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full rounded-xl border border-[#EBEBEB] px-3 py-2.5 text-sm focus:border-[#B8860B] focus:outline-none" />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-gray-700">Time Slot</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['Morning', 'Evening', 'Night'].map(slot => (
                                    <button key={slot} onClick={() => setTimeSlot(slot)}
                                        className={`rounded-xl py-2 text-sm font-semibold transition-all ${
                                            timeSlot === slot ? 'bg-[#B8860B] text-white' : 'border border-[#EBEBEB] text-gray-600 hover:border-[#B8860B]'
                                        }`}>
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-gray-700">Number of Guests (optional)</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['50-100', '100-200', '200-300', '300-500', '500-800', '800+'].map(range => (
                                    <button key={range} type="button" onClick={() => setGuests(range)}
                                        className={`rounded-xl py-2 text-sm font-semibold transition-all ${
                                            guests === range ? 'bg-[#B8860B] text-white' : 'border border-[#EBEBEB] text-gray-600 hover:border-[#B8860B]'
                                        }`}>
                                        {range}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-gray-700">Additional Notes (optional)</label>
                            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                                placeholder="Any special requirements..."
                                className="w-full resize-none rounded-xl border border-[#EBEBEB] px-3 py-2.5 text-sm focus:border-[#B8860B] focus:outline-none" />
                        </div>

                        {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

                        <button onClick={submit} disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
                            style={{ backgroundColor: '#E91E8C' }}>
                            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                            Send Booking Request
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
