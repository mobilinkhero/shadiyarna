'use client'

import { useState, useEffect } from 'react'
import { Calendar, MapPin, Clock, Users, MessageCircle, Package, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const tabs = ['Upcoming', 'Pending', 'Completed', 'Cancelled']
const statusMap: Record<string, string> = { Upcoming: 'CONFIRMED', Pending: 'PENDING', Completed: 'COMPLETED', Cancelled: 'CANCELLED' }
const statusColors: Record<string, string> = {
    CONFIRMED: 'text-green-600 bg-green-50',
    PENDING: 'text-orange-500 bg-orange-50',
    COMPLETED: 'text-blue-600 bg-blue-50',
    CANCELLED: 'text-red-500 bg-red-50',
}

interface Booking {
    id: string; status: string; date: string; time?: string | null; guests?: number | null
    vendor: { id: string; name: string; city: string; imageUrl: string; phone: string }
    package?: { name: string; price: string } | null
}

export default function BookingsPage() {
    const [tabIndex, setTabIndex] = useState(0)
    const [bookings, setBookings] = useState<Booking[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            setLoading(true)
            try {
                const token = localStorage.getItem('token')
                if (!token) { setLoading(false); return }
                const res = await fetch(`/api/bookings?status=${statusMap[tabs[tabIndex]]}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                const json = await res.json()
                if (json.success) setBookings(json.data)
                else setBookings([])
            } catch { setBookings([]) }
            setLoading(false)
        }
        load()
    }, [tabIndex])

    return (
        <div className="min-h-screen bg-[#F8F7F4]">
            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">My Bookings</h1>
                    <p className="mt-1 text-gray-500">Track and manage all your vendor bookings</p>
                </div>

                {/* Tabs */}
                <div className="mb-6 flex gap-2 overflow-x-auto">
                    {tabs.map((tab, i) => (
                        <button key={tab} onClick={() => setTabIndex(i)}
                            className={`shrink-0 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
                                i === tabIndex
                                    ? 'bg-[#B8860B] text-white shadow-sm'
                                    : 'border border-[#EBEBEB] bg-white text-gray-600 hover:border-[#B8860B]/30 hover:text-[#B8860B]'
                            }`}>
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-40 animate-pulse rounded-2xl bg-white" />
                        ))}
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-20 text-center shadow-sm">
                        <Calendar className="mb-4 h-16 w-16 text-gray-200" />
                        <h3 className="font-semibold text-gray-700">No {tabs[tabIndex].toLowerCase()} bookings</h3>
                        <p className="mt-1 text-sm text-gray-400">Your bookings will appear here</p>
                        <Link href="/vendors"
                            className="mt-5 rounded-xl bg-[#B8860B] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#D4A017]">
                            Browse Vendors
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map(booking => {
                            const d = new Date(booking.date)
                            const month = d.toLocaleString('en', { month: 'short' }).toUpperCase()
                            const day = d.getDate()
                            const year = d.getFullYear()
                            const statusStyle = statusColors[booking.status] ?? 'text-gray-500 bg-gray-50'

                            return (
                                <div key={booking.id} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#EBEBEB]">
                                    <div className="p-5">
                                        <div className="flex items-start gap-4">
                                            {/* Vendor image */}
                                            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                                                <img src={booking.vendor.imageUrl} alt={booking.vendor.name} className="h-full w-full object-cover" />
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-start justify-between gap-2">
                                                    <div>
                                                        <h3 className="font-bold text-gray-900">{booking.vendor.name}</h3>
                                                        <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                                                            <MapPin className="h-3.5 w-3.5" />
                                                            <span>{booking.vendor.city}</span>
                                                        </div>
                                                    </div>
                                                    {/* Date badge */}
                                                    <div className="shrink-0 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-center">
                                                        <p className="text-xs font-bold text-[#B8860B]">{month}</p>
                                                        <p className="text-2xl font-bold leading-none text-[#B8860B]">{day}</p>
                                                        <p className="text-xs text-[#B8860B]">{year}</p>
                                                    </div>
                                                </div>

                                                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                                                    {booking.time && (
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="h-3.5 w-3.5" /> {booking.time}
                                                        </span>
                                                    )}
                                                    {booking.guests && (
                                                        <span className="flex items-center gap-1">
                                                            <Users className="h-3.5 w-3.5" /> {booking.guests} guests
                                                        </span>
                                                    )}
                                                    {booking.package && (
                                                        <span className="flex items-center gap-1">
                                                            <Package className="h-3.5 w-3.5" /> {booking.package.name}
                                                        </span>
                                                    )}
                                                    <span className={`ml-auto rounded-full px-3 py-0.5 text-xs font-semibold ${statusStyle}`}>
                                                        {booking.status.charAt(0) + booking.status.slice(1).toLowerCase()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex gap-3 border-t border-[#EBEBEB] pt-4">
                                            <button className="flex-1 rounded-xl border border-[#EBEBEB] py-2.5 text-sm font-medium text-gray-700 hover:border-[#B8860B]/30 hover:text-[#B8860B] transition-colors">
                                                View Details
                                            </button>
                                            <a href={`tel:${booking.vendor.phone}`}
                                                className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium text-white transition-all hover:opacity-90"
                                                style={{ backgroundColor: '#25D366' }}>
                                                <MessageCircle className="h-4 w-4" /> Chat
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
