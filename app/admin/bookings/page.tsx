'use client'

import { useEffect, useState } from 'react'
import { Eye, Calendar, MapPin, Phone, Mail, User, Package, Loader2, CheckCircle, X as XIcon } from 'lucide-react'
import PageHeader from '@/components/admin/PageHeader'
import Modal from '@/components/admin/Modal'

const tabs = ['All', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'REJECTED']
const statusColors: Record<string, string> = {
    PENDING: 'bg-amber-50 text-amber-700 ring-amber-200',
    CONFIRMED: 'bg-green-50 text-green-700 ring-green-200',
    COMPLETED: 'bg-blue-50 text-blue-700 ring-blue-200',
    CANCELLED: 'bg-red-50 text-red-700 ring-red-200',
    REJECTED: 'bg-gray-50 text-gray-600 ring-gray-200',
}

interface Booking {
    id: string; status: string; date: string; time?: string | null
    guests?: number | null; notes?: string | null; totalAmount?: number | null
    createdAt: string
    user: { id: string; name?: string | null; phone: string; email?: string | null; avatar?: string | null }
    vendor: { id: string; name: string; slug: string; imageUrl: string; city: string; phone: string }
    package?: { id: string; name: string; price: string } | null
    bookingAddons: { id: string; quantity: number; addon: { id: string; name: string; price: string } }[]
}

function getToken() {
    if (typeof document === 'undefined') return ''
    return document.cookie.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1] ?? ''
}

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([])
    const [loading, setLoading] = useState(true)
    const [tab, setTab] = useState('All')
    const [detail, setDetail] = useState<Booking | null>(null)

    async function load() {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (tab !== 'All') params.set('status', tab)
            const res = await fetch(`/api/admin/bookings?${params}`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            })
            const json = await res.json()
            if (json.success) setBookings(json.data)
        } finally { setLoading(false) }
    }

    useEffect(() => { load() }, [tab])

    async function updateStatus(id: string, status: string) {
        await fetch(`/api/bookings/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
            body: JSON.stringify({ status }),
        })
        load()
        if (detail?.id === id) setDetail(null)
    }

    return (
        <div>
            <PageHeader title="Bookings" description={`${bookings.length} bookings`} />

            {/* Tabs */}
            <div className="mb-4 flex gap-2 overflow-x-auto rounded-xl border border-gray-200 bg-white p-1.5">
                {tabs.map(t => (
                    <button key={t} onClick={() => setTab(t)}
                        className={`shrink-0 rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${
                            tab === t ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
                        }`}>
                        {t.charAt(0) + t.slice(1).toLowerCase()}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            {['ID', 'User', 'Vendor', 'Package', 'Event Date', 'Status', 'Created', ''].map(h => (
                                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan={8} className="px-4 py-12 text-center text-sm text-gray-400">Loading...</td></tr>
                        ) : bookings.length === 0 ? (
                            <tr><td colSpan={8} className="px-4 py-12 text-center text-sm text-gray-400">No bookings</td></tr>
                        ) : bookings.map(b => (
                            <tr key={b.id} className="hover:bg-gray-50">
                                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-gray-500">{b.id.slice(0, 8)}…</td>
                                <td className="whitespace-nowrap px-4 py-3">
                                    <p className="text-sm font-medium text-gray-900">{b.user.name ?? '—'}</p>
                                    <p className="text-xs text-gray-500">{b.user.phone}</p>
                                </td>
                                <td className="whitespace-nowrap px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <img src={b.vendor.imageUrl} alt="" className="h-7 w-7 rounded-lg object-cover" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{b.vendor.name}</p>
                                            <p className="text-xs text-gray-500">{b.vendor.city}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{b.package?.name ?? '—'}</td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                                    {new Date(b.date).toLocaleDateString()}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3">
                                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusColors[b.status] ?? statusColors.PENDING}`}>
                                        {b.status.charAt(0) + b.status.slice(1).toLowerCase()}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                    {new Date(b.createdAt).toLocaleDateString()}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-right">
                                    <button onClick={() => setDetail(b)}
                                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700" title="View">
                                        <Eye className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {detail && <BookingDetail booking={detail} onClose={() => setDetail(null)} onStatusChange={updateStatus} />}
        </div>
    )
}

function BookingDetail({ booking, onClose, onStatusChange }: {
    booking: Booking; onClose: () => void; onStatusChange: (id: string, status: string) => void
}) {
    const [updating, setUpdating] = useState<string | null>(null)

    async function update(status: string) {
        setUpdating(status)
        await onStatusChange(booking.id, status)
        setUpdating(null)
    }

    return (
        <Modal open={true} onClose={onClose} title={`Booking #${booking.id.slice(0, 8)}`}
            description={`Created ${new Date(booking.createdAt).toLocaleString()}`} maxWidth="lg">
            <div className="space-y-5">

                {/* Status banner */}
                <div className={`rounded-xl p-4 ring-1 ${statusColors[booking.status]}`}>
                    <p className="text-xs font-medium opacity-70">Current Status</p>
                    <p className="mt-0.5 text-lg font-bold">{booking.status.charAt(0) + booking.status.slice(1).toLowerCase()}</p>
                </div>

                {/* User + Vendor cards */}
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-gray-200 p-4">
                        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <User className="h-4 w-4" /> Customer
                        </h3>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-rose-400 text-sm font-bold text-white">
                                {(booking.user.name ?? booking.user.phone)[0].toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <p className="font-semibold text-gray-900">{booking.user.name ?? '—'}</p>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <Phone className="h-3 w-3" /> {booking.user.phone}
                                </p>
                                {booking.user.email && (
                                    <p className="text-sm text-gray-500 flex items-center gap-1 truncate">
                                        <Mail className="h-3 w-3" /> {booking.user.email}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 p-4">
                        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <Package className="h-4 w-4" /> Vendor
                        </h3>
                        <div className="flex items-center gap-3">
                            <img src={booking.vendor.imageUrl} alt="" className="h-10 w-10 rounded-lg object-cover" />
                            <div className="min-w-0">
                                <p className="font-semibold text-gray-900">{booking.vendor.name}</p>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <MapPin className="h-3 w-3" /> {booking.vendor.city}
                                </p>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <Phone className="h-3 w-3" /> {booking.vendor.phone}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Event details */}
                <div className="rounded-xl border border-gray-200 p-4">
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <Calendar className="h-4 w-4" /> Event Details
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-4">
                        <div>
                            <p className="text-xs text-gray-400">Date</p>
                            <p className="text-sm font-medium text-gray-900">{new Date(booking.date).toLocaleDateString()}</p>
                        </div>
                        {booking.time && (
                            <div>
                                <p className="text-xs text-gray-400">Time</p>
                                <p className="text-sm font-medium text-gray-900">{booking.time}</p>
                            </div>
                        )}
                        {booking.guests && (
                            <div>
                                <p className="text-xs text-gray-400">Guests</p>
                                <p className="text-sm font-medium text-gray-900">{booking.guests}</p>
                            </div>
                        )}
                        {booking.totalAmount && (
                            <div>
                                <p className="text-xs text-gray-400">Total</p>
                                <p className="text-sm font-medium text-gray-900">Rs. {booking.totalAmount.toLocaleString()}</p>
                            </div>
                        )}
                    </div>
                    {booking.package && (
                        <div className="mt-3 rounded-lg bg-amber-50 p-3">
                            <p className="text-xs text-amber-700">Package</p>
                            <p className="font-semibold text-amber-900">{booking.package.name} — {booking.package.price}</p>
                        </div>
                    )}
                    {booking.bookingAddons.length > 0 && (
                        <div className="mt-3">
                            <p className="mb-2 text-xs font-semibold text-gray-500">Add-ons</p>
                            <div className="space-y-1">
                                {booking.bookingAddons.map(ba => (
                                    <div key={ba.id} className="flex justify-between text-sm">
                                        <span className="text-gray-600">{ba.addon.name} × {ba.quantity}</span>
                                        <span className="font-medium text-gray-900">{ba.addon.price}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {booking.notes && (
                        <div className="mt-3 rounded-lg bg-gray-50 p-3">
                            <p className="text-xs text-gray-500">Notes</p>
                            <p className="mt-1 text-sm text-gray-700">{booking.notes}</p>
                        </div>
                    )}
                </div>

                {/* Status update actions */}
                <div>
                    <p className="mb-2 text-sm font-semibold text-gray-700">Update Status</p>
                    <div className="flex flex-wrap gap-2">
                        {['CONFIRMED', 'COMPLETED', 'CANCELLED', 'REJECTED'].map(s => (
                            <button key={s} onClick={() => update(s)} disabled={updating !== null || booking.status === s}
                                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold ring-1 transition-all disabled:opacity-50 ${statusColors[s]}`}>
                                {updating === s ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    : s === 'CANCELLED' || s === 'REJECTED' ? <XIcon className="h-3.5 w-3.5" />
                                    : <CheckCircle className="h-3.5 w-3.5" />}
                                Mark {s.charAt(0) + s.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </Modal>
    )
}
