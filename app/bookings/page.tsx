'use client'

import { useState, useEffect } from 'react'
import { Calendar, MapPin, Clock, Users, ChevronRight, MessageCircle } from 'lucide-react'
import Link from 'next/link'

const tabs = ['Upcoming', 'Pending', 'Completed', 'Cancelled']
const statusMap: Record<string, string> = { 'Upcoming': 'CONFIRMED', 'Pending': 'PENDING', 'Completed': 'COMPLETED', 'Cancelled': 'CANCELLED' }

const statusColors: Record<string, string> = {
    CONFIRMED: 'text-green-600',
    PENDING: 'text-orange-500',
    COMPLETED: 'text-blue-600',
    CANCELLED: 'text-red-500',
}

interface Booking {
    id: string
    status: string
    date: string
    time?: string | null
    guests?: number | null
    notes?: string | null
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
            } catch { /* ignore */ }
            setLoading(false)
        }
        load()
    }, [tabIndex])

    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            {/* Header */}
            <div className="bg-white border-b px-4 py-4">
                <h1 className="text-lg font-bold text-gray-900">My Bookings</h1>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b px-4 py-3">
                <div className="flex gap-2 overflow-x-auto">
                    {tabs.map((tab, i) => (
                        <button
                            key={tab}
                            onClick={() => setTabIndex(i)}
                            className={`shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-all ${i === tabIndex ? 'text-white' : 'border border-gray-200 text-gray-500'}`}
                            style={i === tabIndex ? { backgroundColor: '#E91E8C' } : {}}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="px-4 py-4">
                {loading ? (
                    <div className="space-y-3">
                        {[1, 2].map(i => (
                            <div key={i} className="h-36 rounded-2xl bg-white shimmer" />
                        ))}
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <Calendar className="mb-4 h-16 w-16 text-gray-200" />
                        <p className="font-semibold text-gray-500">No bookings found</p>
                        <p className="mt-1 text-sm text-gray-400">Your bookings will appear here</p>
                        <Link href="/vendors" className="mt-4 rounded-xl px-6 py-2.5 text-sm font-semibold text-white" style={{ backgroundColor: '#B8860B' }}>
                            Browse Vendors
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {bookings.map(booking => {
                            const d = new Date(booking.date)
                            const month = d.toLocaleString('en', { month: 'short' }).toUpperCase()
                            const day = d.getDate()
                            const year = d.getFullYear()
                            return (
                                <div key={booking.id} className="overflow-hidden rounded-2xl bg-white shadow-sm">
                                    <div className="p-4">
                                        {/* Top row */}
                                        <div className="flex items-start gap-3">
                                            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                                                <img src={booking.vendor.imageUrl} alt={booking.vendor.name} className="h-full w-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-gray-900">{booking.vendor.name}</p>
                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                    <MapPin className="h-3 w-3" />
                                                    <span>{booking.vendor.city}</span>
                                                </div>
                                            </div>
                                            {/* Date badge */}
                                            <div className="shrink-0 rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-center">
                                                <p className="text-xs font-bold text-[#B8860B]">{month}</p>
                                                <p className="text-xl font-bold leading-none text-[#B8860B]">{day}</p>
                                                <p className="text-xs text-[#B8860B]">{year}</p>
                                            </div>
                                        </div>

                                        <div className="my-3 border-t border-gray-100" />

                                        {/* Middle row */}
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
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
                                                <span className="font-medium text-gray-700">{booking.package.name}</span>
                                            )}
                                            <span className={`ml-auto font-semibold ${statusColors[booking.status] ?? 'text-gray-500'}`}>
                                                {booking.status.charAt(0) + booking.status.slice(1).toLowerCase()}
                                            </span>
                                        </div>

                                        <div className="mt-3 flex gap-2">
                                            <button className="flex-1 rounded-full border border-gray-200 py-2 text-sm font-medium text-gray-700">
                                                View Details
                                            </button>
                                            <a
                                                href={`tel:${booking.vendor.phone}`}
                                                className="flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-sm font-medium text-white"
                                                style={{ backgroundColor: '#25D366' }}
                                            >
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
