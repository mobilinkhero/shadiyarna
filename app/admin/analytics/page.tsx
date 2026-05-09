import { prisma } from '@/lib/prisma'
import { Users, Building2, Calendar, Star, TrendingUp } from 'lucide-react'

export default async function AdminAnalyticsPage() {
    const [
        totalUsers, totalVendors, totalBookings, totalReviews,
        verifiedVendors, pendingBookings, completedBookings,
        topVendors, bookingsByStatus,
    ] = await Promise.all([
        prisma.user.count({ where: { isActive: true } }),
        prisma.vendor.count(),
        prisma.booking.count(),
        prisma.review.count(),
        prisma.vendor.count({ where: { isVerified: true } }),
        prisma.booking.count({ where: { status: 'PENDING' } }),
        prisma.booking.count({ where: { status: 'COMPLETED' } }),
        prisma.vendor.findMany({
            take: 5,
            orderBy: { totalReviews: 'desc' },
            select: { id: true, name: true, city: true, rating: true, totalReviews: true, _count: { select: { bookings: true } } },
        }),
        prisma.booking.groupBy({
            by: ['status'],
            _count: { status: true },
        }),
    ])

    const stats = [
        { label: 'Total Users', value: totalUsers, icon: Users, color: 'bg-blue-500' },
        { label: 'Total Vendors', value: totalVendors, icon: Building2, color: 'bg-green-500' },
        { label: 'Total Bookings', value: totalBookings, icon: Calendar, color: 'bg-purple-500' },
        { label: 'Total Reviews', value: totalReviews, icon: Star, color: 'bg-amber-500' },
        { label: 'Verified Vendors', value: verifiedVendors, icon: TrendingUp, color: 'bg-teal-500' },
        { label: 'Pending Bookings', value: pendingBookings, icon: Calendar, color: 'bg-orange-500' },
        { label: 'Completed Bookings', value: completedBookings, icon: Calendar, color: 'bg-emerald-500' },
        { label: 'Unverified Vendors', value: totalVendors - verifiedVendors, icon: Building2, color: 'bg-red-500' },
    ]

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                <p className="text-gray-600">Platform overview and key metrics</p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {stats.map((s) => {
                    const Icon = s.icon
                    return (
                        <div key={s.label} className="rounded-xl border bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">{s.label}</p>
                                    <p className="mt-1 text-2xl font-bold text-gray-900">{s.value.toLocaleString()}</p>
                                </div>
                                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.color}`}>
                                    <Icon className="h-5 w-5 text-white" />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Bookings by status */}
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h2 className="mb-4 font-semibold text-gray-900">Bookings by Status</h2>
                    <div className="space-y-3">
                        {bookingsByStatus.map((b) => {
                            const pct = totalBookings > 0 ? Math.round((b._count.status / totalBookings) * 100) : 0
                            const colors: Record<string, string> = {
                                PENDING: 'bg-amber-500', CONFIRMED: 'bg-blue-500',
                                COMPLETED: 'bg-green-500', CANCELLED: 'bg-red-500', REJECTED: 'bg-gray-400',
                            }
                            return (
                                <div key={b.status}>
                                    <div className="mb-1 flex justify-between text-sm">
                                        <span className="font-medium text-gray-700">{b.status}</span>
                                        <span className="text-gray-500">{b._count.status} ({pct}%)</span>
                                    </div>
                                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                                        <div className={`h-full rounded-full ${colors[b.status] ?? 'bg-gray-400'}`} style={{ width: `${pct}%` }} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Top vendors */}
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h2 className="mb-4 font-semibold text-gray-900">Top Vendors by Reviews</h2>
                    <div className="space-y-3">
                        {topVendors.map((v, i) => (
                            <div key={v.id} className="flex items-center gap-3">
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600">
                                    {i + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="truncate font-medium text-gray-900">{v.name}</p>
                                    <p className="text-xs text-gray-500">{v.city} · {v._count.bookings} bookings</p>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                                    <span className="text-sm font-semibold">{v.rating.toFixed(1)}</span>
                                    <span className="text-xs text-gray-400">({v.totalReviews})</span>
                                </div>
                            </div>
                        ))}
                        {topVendors.length === 0 && <p className="text-sm text-gray-500">No vendor data yet.</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}
