'use client'

import { useState } from 'react'
import { Star, MapPin, CheckCircle, Package, Plus, Clock, Phone, Mail, Globe, Calendar, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface Package { id: string; name: string; price: string; originalPrice?: string | null; description?: string | null; features: string[]; isPopular: boolean }
interface Addon { id: string; name: string; price: string; description?: string | null }
interface Review { id: string; rating: number; comment?: string | null; userName: string; userAvatar?: string | null; createdAt: string }
interface SimilarVendor { id: string; name: string; slug: string; city: string; rating: number; imageUrl: string; priceRange?: string | null; categoryName: string }

interface VendorData {
    id: string; name: string; slug: string; city: string; address?: string | null
    phone: string; email?: string | null; website?: string | null; instagram?: string | null; facebook?: string | null
    rating: number; totalReviews: number; priceRange?: string | null
    isVerified: boolean; respondsQuickly: boolean
    about?: string | null; description?: string | null
    features: string[]; details: Record<string, string>; workingHours: Record<string, string>
    images: string[]; categoryName: string; bookings: number; wishlists: number
    packages: Package[]; addons: Addon[]; reviews: Review[]; similar: SimilarVendor[]
}

const tabs = ['Details', 'Gallery', 'Reviews', 'Info']

export default function VendorTabs({ vendor }: { vendor: VendorData }) {
    const [activeTab, setActiveTab] = useState(0)
    const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
    const [expandedPkg, setExpandedPkg] = useState<string | null>(null)
    const [showBookingForm, setShowBookingForm] = useState(false)
    const [date, setDate] = useState('')
    const [timeSlot, setTimeSlot] = useState('Evening')
    const [guests, setGuests] = useState('')
    const [notes, setNotes] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    async function handleBook() {
        if (!showBookingForm) { setShowBookingForm(true); return }
        if (!date) { setError('Please select an event date'); return }
        setLoading(true); setError('')
        try {
            const token = localStorage.getItem('token')
            if (!token) { window.location.href = `/login?redirect=/vendors/${vendor.slug}`; return }
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ vendorId: vendor.id, packageId: selectedPackage?.id, date, guests: guests || undefined, notes: notes || undefined }),
            })
            const json = await res.json()
            if (!res.ok) throw new Error(json.error || 'Booking failed')
            setSuccess(true)
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Something went wrong')
        } finally { setLoading(false) }
    }

    return (
        <div>
            {/* Sticky tab bar */}
            <div className="sticky top-16 z-30 border-b bg-white">
                <div className="flex">
                    {tabs.map((tab, i) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(i)}
                            className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === i ? 'border-b-2 border-[#B8860B] text-[#B8860B]' : 'text-gray-500'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab content */}
            <div className="pb-32">
                {/* ── Details tab ── */}
                {activeTab === 0 && (
                    <div>
                        {/* Details grid */}
                        {Object.keys(vendor.details).length > 0 && (
                            <div className="bg-white px-4 py-4">
                                <h2 className="mb-3 font-bold text-gray-900">Details</h2>
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                    {Object.entries(vendor.details).map(([k, v]) => (
                                        <div key={k} className="rounded-xl bg-gray-50 p-3">
                                            <p className="text-xs text-gray-400">{k}</p>
                                            <p className="mt-0.5 text-sm font-semibold text-gray-800">{v}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="h-2 bg-[#F5F5F5]" />

                        {/* Packages */}
                        {vendor.packages.length > 0 && (
                            <div className="bg-white px-4 py-4">
                                <h2 className="mb-4 flex items-center gap-2 font-bold text-gray-900">
                                    <Package className="h-4 w-4 text-[#B8860B]" /> Choose Your Package
                                </h2>
                                <div className="space-y-3">
                                    {vendor.packages.map((pkg, idx) => {
                                        const isSelected = selectedPackage?.id === pkg.id
                                        const isExpanded = expandedPkg === pkg.id
                                        const icons = ['🏆', '💎', '⭐']
                                        return (
                                            <div
                                                key={pkg.id}
                                                onClick={() => { setSelectedPackage(pkg); setExpandedPkg(isExpanded ? null : pkg.id) }}
                                                className={`cursor-pointer rounded-2xl border-2 p-4 transition-all ${isSelected ? 'border-[#B8860B] bg-[#FFF8EE]' : 'border-gray-200 bg-gray-50'}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${isSelected ? 'bg-[#B8860B]' : 'bg-gray-200'}`}>
                                                        {isSelected ? <span className="text-white text-lg">{icons[idx % 3]}</span> : <span>{icons[idx % 3]}</span>}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className={`font-bold ${isSelected ? 'text-[#B8860B]' : 'text-gray-900'}`}>{pkg.name}</p>
                                                        <p className={`text-base font-bold ${isSelected ? 'text-[#B8860B]' : 'text-[#E91E8C]'}`}>{pkg.price}</p>
                                                    </div>
                                                    <span className={`text-lg transition-transform ${isExpanded ? 'rotate-180' : ''}`}>⌄</span>
                                                </div>

                                                {isExpanded && (
                                                    <div className="mt-3 border-t border-gray-200 pt-3">
                                                        {pkg.description && <p className="mb-2 text-sm text-gray-600">{pkg.description}</p>}
                                                        {pkg.features.length > 0 && (
                                                            <ul className="space-y-1.5">
                                                                {pkg.features.map((f, i) => (
                                                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                                                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" /> {f}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Add-ons */}
                        {vendor.addons.length > 0 && (
                            <>
                                <div className="h-2 bg-[#F5F5F5]" />
                                <div className="bg-white px-4 py-4">
                                    <h2 className="mb-3 flex items-center gap-2 font-bold text-gray-900">
                                        <Plus className="h-4 w-4 text-[#B8860B]" /> Add-ons & Extras
                                    </h2>
                                    <div className="space-y-2">
                                        {vendor.addons.map(addon => (
                                            <div key={addon.id} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FFF8EE]">
                                                    <Plus className="h-4 w-4 text-[#B8860B]" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-semibold text-gray-900">{addon.name}</p>
                                                    {addon.description && <p className="text-xs text-gray-500">{addon.description}</p>}
                                                </div>
                                                <span className="rounded-lg bg-[#FFF8EE] px-2.5 py-1 text-sm font-bold text-[#E91E8C]">{addon.price}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Booking form */}
                        {showBookingForm && (
                            <>
                                <div className="h-2 bg-[#F5F5F5]" />
                                <div className="bg-white px-4 py-4">
                                    <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                                        Fill in your event details to send a booking request to this vendor.
                                    </div>
                                    <h2 className="mb-3 font-bold text-gray-900">Event Details</h2>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="mb-1 block text-xs font-semibold text-gray-700">Event Date *</label>
                                            <input type="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]}
                                                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-[#B8860B] focus:outline-none" />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-xs font-semibold text-gray-700">Time Slot</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {['Morning', 'Evening', 'Night'].map(slot => (
                                                    <button key={slot} onClick={() => setTimeSlot(slot)}
                                                        className={`rounded-xl py-2.5 text-sm font-semibold transition-all ${timeSlot === slot ? 'bg-[#B8860B] text-white' : 'border border-gray-200 text-gray-600'}`}>
                                                        {slot}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-xs font-semibold text-gray-700">Number of Guests (optional)</label>
                                            <input type="number" value={guests} onChange={e => setGuests(e.target.value)} placeholder="e.g. 200"
                                                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-[#B8860B] focus:outline-none" />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-xs font-semibold text-gray-700">Special Requirements (optional)</label>
                                            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Any special requests..."
                                                className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-[#B8860B] focus:outline-none" />
                                        </div>
                                        {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Similar vendors */}
                        {vendor.similar.length > 0 && (
                            <>
                                <div className="h-2 bg-[#F5F5F5]" />
                                <div className="bg-white px-4 py-4">
                                    <h2 className="mb-3 font-bold text-gray-900">Compare with Similar {vendor.categoryName}</h2>
                                    <div className="flex gap-3 overflow-x-auto pb-1">
                                        {vendor.similar.map(sv => (
                                            <Link key={sv.id} href={`/vendors/${sv.slug}`}
                                                className="group w-44 shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                                                <div className="h-28 overflow-hidden bg-gray-100">
                                                    <img src={sv.imageUrl} alt={sv.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                                                </div>
                                                <div className="p-3">
                                                    <p className="truncate text-sm font-semibold text-gray-900 group-hover:text-[#B8860B]">{sv.name}</p>
                                                    <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                                                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                                        <span>{sv.rating.toFixed(1)}</span>
                                                        <span className="mx-1">·</span>
                                                        <MapPin className="h-3 w-3" />
                                                        <span>{sv.city}</span>
                                                    </div>
                                                    {sv.priceRange && <p className="mt-1 text-sm font-bold text-[#B8860B]">{sv.priceRange}</p>}
                                                    <button className="mt-2 w-full rounded-lg border border-[#E91E8C] py-1.5 text-xs font-semibold text-[#E91E8C]">
                                                        Check Availability
                                                    </button>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* ── Gallery tab ── */}
                {activeTab === 1 && (
                    <div className="bg-white px-4 py-4">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="font-bold text-gray-900">Gallery</h2>
                            <span className="text-sm text-gray-500">{vendor.images.length} photos</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5">
                            {vendor.images.map((img, i) => (
                                <div key={i} className="aspect-square overflow-hidden rounded-xl bg-gray-100">
                                    <img src={img} alt={`${vendor.name} ${i + 1}`} className="h-full w-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Reviews tab ── */}
                {activeTab === 2 && (
                    <div className="bg-white px-4 py-4">
                        {/* Rating summary */}
                        <div className="mb-4 rounded-2xl bg-[#FFF8EE] p-4">
                            <div className="flex items-center gap-6">
                                <div className="text-center">
                                    <p className="text-4xl font-bold text-gray-900">{vendor.rating.toFixed(1)}</p>
                                    <div className="mt-1 flex justify-center gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`h-4 w-4 ${i < Math.floor(vendor.rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} />
                                        ))}
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">{vendor.totalReviews} reviews</p>
                                </div>
                                <div className="flex-1 space-y-1">
                                    {[5, 4, 3, 2, 1].map(stars => {
                                        const pct = stars === 5 ? 70 : stars === 4 ? 20 : stars === 3 ? 5 : stars === 2 ? 3 : 2
                                        return (
                                            <div key={stars} className="flex items-center gap-2">
                                                <span className="w-3 text-xs text-gray-500">{stars}</span>
                                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                                <div className="flex-1 overflow-hidden rounded-full bg-gray-200 h-1.5">
                                                    <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        {vendor.reviews.length === 0 ? (
                            <div className="py-10 text-center">
                                <Star className="mx-auto mb-2 h-10 w-10 text-gray-200" />
                                <p className="text-gray-500">No reviews yet</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {vendor.reviews.map(review => (
                                    <div key={review.id} className="rounded-2xl bg-gray-50 p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#B8860B] to-[#E91E8C] text-sm font-bold text-white">
                                                {review.userName[0].toUpperCase()}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-900">{review.userName}</p>
                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} />
                                                    ))}
                                                    <span className="ml-1 text-xs text-gray-400">
                                                        {new Date(review.createdAt).toLocaleDateString('en-PK', { month: 'short', year: 'numeric' })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {review.comment && <p className="mt-2 text-sm leading-relaxed text-gray-600">{review.comment}</p>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ── Info tab ── */}
                {activeTab === 3 && (
                    <div className="space-y-2">
                        {/* Contact */}
                        <div className="bg-white px-4 py-4">
                            <h2 className="mb-3 font-bold text-gray-900">Contact Information</h2>
                            <div className="space-y-3">
                                <a href={`tel:${vendor.phone}`} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFF8EE]">
                                        <Phone className="h-4 w-4 text-[#B8860B]" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-400">Phone</p>
                                        <p className="text-sm font-medium text-gray-900">{vendor.phone}</p>
                                    </div>
                                    <span className="text-xs text-gray-400">→</span>
                                </a>
                                {vendor.email && (
                                    <a href={`mailto:${vendor.email}`} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFF8EE]">
                                            <Mail className="h-4 w-4 text-[#B8860B]" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-400">Email</p>
                                            <p className="text-sm font-medium text-gray-900">{vendor.email}</p>
                                        </div>
                                        <span className="text-xs text-gray-400">→</span>
                                    </a>
                                )}
                                <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFF8EE]">
                                        <MapPin className="h-4 w-4 text-[#B8860B]" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-400">Location</p>
                                        <p className="text-sm font-medium text-gray-900">{vendor.address || vendor.city}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Working hours */}
                        {Object.keys(vendor.workingHours).length > 0 && (
                            <div className="bg-white px-4 py-4">
                                <h2 className="mb-3 flex items-center gap-2 font-bold text-gray-900">
                                    <Clock className="h-4 w-4 text-[#B8860B]" /> Working Hours
                                </h2>
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
                )}
            </div>

            {/* Sticky bottom booking bar */}
            <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white px-4 py-3 shadow-lg">
                {success ? (
                    <div className="flex items-center justify-center gap-2 rounded-xl bg-green-50 py-3 text-green-700">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-semibold">Booking Request Sent!</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <div className="flex-1">
                            <p className="text-lg font-bold text-gray-900">
                                {selectedPackage?.price ?? vendor.priceRange ?? 'Contact for price'}
                            </p>
                            <p className="text-xs text-gray-500">
                                {selectedPackage ? selectedPackage.name : 'Starting price'}
                            </p>
                        </div>
                        <button
                            onClick={handleBook}
                            disabled={loading}
                            className="flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white disabled:opacity-60"
                            style={{ backgroundColor: '#E91E8C' }}
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                            {showBookingForm ? 'Submit Booking' : 'Book Now'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
