import {
    Users, Building2, Calendar, Star, TrendingUp, ArrowUpRight,
    Plus, Eye, Edit, CheckCircle, Clock, XCircle,
} from 'lucide-react'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

async function getDashboardData() {
    const [
        userCount, vendorCount, bookingCount, reviewCount,
        pendingBookings, confirmedBookings, verifiedVendors,
        recentBookings, recentVendors, recentUsers,
    ] = await Promise.all([
        prisma.user.count({ where: { isActive: true } }),
        prisma.vendor.count(),
        prisma.booking.count(),
        prisma.review.count(),
        prisma.booking.count({ where: { status: 'PENDING' } }),
        prisma.booking.count({ where: { status: 'CONFIRMED' } }),
        prisma.vendor.count({ where: { isVerified: true } }),
        prisma.booking.findMany({
            take: 6,
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { name: true, phone: true } },
                vendor: { select: { name: true, slug: true, imageUrl: true } },
            },
        }),
        prisma.vendor.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                categories: { include: { category: true } },
                _count: { select: { bookings: true, reviews: true } },
            },
        }),
        prisma.user.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: { id: true, name: true, phone: true, role: true, createdAt: true, avatar: true },
        }),
    ])

    return {
        userCount, vendorCount, bookingCount, reviewCount,
        pendingBookings, confirmedBookings, verifiedVendors,
        recentBookings, recentVendors, recentUsers,
    }
}

export default async function AdminDashboard() {
    const data = await getDashboardData()

    const kpis = [
        {
            label: 'Total Users',
            value: data.userCount,
            change: '+12.5%',
            sub: 'vs last month',
            icon: Users,
            color: 'blue',
        },
        {
            label: 'Total Vendors',
            value: data.vendorCount,
            change: `${data.verifiedVendors} verified`,
            sub: `of ${data.vendorCount} total`,
            icon: Building2,
            color: 'amber',
        },
        {
            label: 'Total Bookings',
            value: data.bookingCount,
            change: `${data.pendingBookings} pending`,
            sub: 'awaiting confirmation',
            icon: Calendar,
            color: 'indigo',
        },
        {
            label: 'Reviews',
            value: data.reviewCount,
            change: '+8.2%',
            sub: 'customer feedback',
            icon: Star,
            color: 'rose',
        },
    ]

    const colorMap: Record<string, { bg: string; text: string; ring: string }> = {
        blue:   { bg: 'bg-blue-50',   text: 'text-blue-600',   ring: 'ring-blue-100' },
        amber:  { bg: 'bg-amber-50',  text: 'text-amber-600',  ring: 'ring-amber-100' },
        indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', ring: 'ring-indigo-100' },
        rose:   { bg: 'bg-rose-50',   text: 'text-rose-600',   ring: 'ring-rose-100' },
    }

    const statusStyle: Record<string, string> = {
        PENDING: 'bg-amber-50 text-amber-700 ring-amber-100',
        CONFIRMED: 'bg-green-50 text-green-700 ring-green-100',
        COMPLETED: 'bg-blue-50 text-blue-700 ring-blue-100',
        CANCELLED: 'bg-red-50 text-red-700 ring-red-100',
        REJECTED: 'bg-gray-50 text-gray-700 ring-gray-100',
    }

    return (
        <div className="space-y-6">

            {/* KPI Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {kpis.map(kpi => {
                    const Icon = kpi.icon
                    const c = colorMap[kpi.color]
                    return (
                        <div key={kpi.label} className="group rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-gray-300 hover:shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${c.bg} ${c.text} ring-4 ${c.ring}`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <span className={`flex items-center gap-0.5 text-xs font-semibold ${c.text}`}>
                                    <ArrowUpRight className="h-3 w-3" />
                                    {kpi.change}
                                </span>
                            </div>
                            <p className="mt-4 text-sm font-medium text-gray-500">{kpi.label}</p>
                            <p className="mt-1 text-2xl font-bold text-gray-900">{kpi.value.toLocaleString()}</p>
                            <p className="mt-1 text-xs text-gray-400">{kpi.sub}</p>
                        </div>
                    )
                })}
            </div>

            {/* Booking status overview */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Chart-like booking overview */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 lg:col-span-2">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="font-semibold text-gray-900">Bookings Overview</h2>
                            <p className="text-sm text-gray-500">Status breakdown of all bookings</p>
                        </div>
                        <Link href="/admin/bookings" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                            View all →
                        </Link>
                    </div>

                    {/* Simple bar viz */}
                    {data.bookingCount > 0 ? (
                        <div className="space-y-4">
                            {[
                                { label: 'Pending', count: data.pendingBookings, icon: Clock, color: 'bg-amber-500' },
                                { label: 'Confirmed', count: data.confirmedBookings, icon: CheckCircle, color: 'bg-green-500' },
                                { label: 'Other', count: data.bookingCount - data.pendingBookings - data.confirmedBookings, icon: XCircle, color: 'bg-gray-400' },
                            ].map(item => {
                                const Icon = item.icon
                                const pct = data.bookingCount > 0 ? Math.round((item.count / data.bookingCount) * 100) : 0
                                return (
                                    <div key={item.label}>
                                        <div className="mb-1.5 flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <Icon className="h-4 w-4 text-gray-500" />
                                                <span className="font-medium text-gray-700">{item.label}</span>
                                            </div>
                                            <span className="text-gray-500">
                                                <span className="font-semibold text-gray-900">{item.count}</span>
                                                <span className="ml-1 text-xs">({pct}%)</span>
                                            </span>
                                        </div>
                                        <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                                            <div className={`h-full rounded-full ${item.color} transition-all`} style={{ width: `${pct}%` }} />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="py-12 text-center">
                            <Calendar className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                            <p className="text-sm font-medium text-gray-600">No bookings yet</p>
                            <p className="mt-1 text-xs text-gray-400">Bookings will appear here as users make them</p>
                        </div>
                    )}
                </div>

                {/* Quick actions */}
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <h2 className="mb-4 font-semibold text-gray-900">Quick Actions</h2>
                    <div className="space-y-2">
                        {[
                            { label: 'Add new vendor', href: '/admin/vendors/new', icon: Building2, color: 'bg-amber-50 text-amber-600' },
                            { label: 'Add category', href: '/admin/categories/new', icon: Plus, color: 'bg-indigo-50 text-indigo-600' },
                            { label: 'Invite user', href: '/admin/users/invite', icon: Users, color: 'bg-blue-50 text-blue-600' },
                            { label: 'View analytics', href: '/admin/analytics', icon: TrendingUp, color: 'bg-rose-50 text-rose-600' },
                        ].map(action => {
                            const Icon = action.icon
                            return (
                                <Link key={action.href} href={action.href}
                                    className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 transition-all hover:border-gray-300 hover:bg-gray-50">
                                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${action.color}`}>
                                        <Icon className="h-4 w-4" />
                                    </div>
                                    <span className="flex-1 text-sm font-medium text-gray-800">{action.label}</span>
                                    <ArrowUpRight className="h-4 w-4 text-gray-300" />
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Recent activity — two columns */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                {/* Recent bookings */}
                <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                    <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                        <div>
                            <h2 className="font-semibold text-gray-900">Recent Bookings</h2>
                            <p className="text-xs text-gray-500">{data.recentBookings.length} latest requests</p>
                        </div>
                        <Link href="/admin/bookings" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                            View all
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {data.recentBookings.length === 0 ? (
                            <p className="px-6 py-12 text-center text-sm text-gray-400">No bookings yet</p>
                        ) : data.recentBookings.map(b => (
                            <div key={b.id} className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50">
                                <img src={b.vendor.imageUrl} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-gray-900">{b.vendor.name}</p>
                                    <p className="truncate text-xs text-gray-500">
                                        by {b.user.name ?? b.user.phone} · {new Date(b.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusStyle[b.status] ?? 'bg-gray-50 text-gray-700 ring-gray-100'}`}>
                                    {b.status.charAt(0) + b.status.slice(1).toLowerCase()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent vendors */}
                <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                    <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                        <div>
                            <h2 className="font-semibold text-gray-900">Recent Vendors</h2>
                            <p className="text-xs text-gray-500">{data.recentVendors.length} newly registered</p>
                        </div>
                        <Link href="/admin/vendors" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                            View all
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {data.recentVendors.length === 0 ? (
                            <p className="px-6 py-12 text-center text-sm text-gray-400">No vendors yet</p>
                        ) : data.recentVendors.map(v => (
                            <div key={v.id} className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50">
                                <img src={v.imageUrl} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5">
                                        <p className="truncate text-sm font-medium text-gray-900">{v.name}</p>
                                        {v.isVerified && <CheckCircle className="h-3.5 w-3.5 shrink-0 text-blue-500" />}
                                    </div>
                                    <p className="truncate text-xs text-gray-500">
                                        {v.categories[0]?.category.name ?? 'Vendor'} · {v.city} · {v._count.bookings} bookings
                                    </p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                    <span className="text-sm font-semibold text-gray-700">{v.rating.toFixed(1)}</span>
                                </div>
                                <Link href={`/admin/vendors/${v.id}`} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                                    <Eye className="h-4 w-4" />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent users */}
            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <div>
                        <h2 className="font-semibold text-gray-900">Recent Users</h2>
                        <p className="text-xs text-gray-500">Latest sign-ups</p>
                    </div>
                    <Link href="/admin/users" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                        View all
                    </Link>
                </div>
                <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50">
                        <tr>
                            {['User', 'Role', 'Phone', 'Joined', ''].map(h => (
                                <th key={h} className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.recentUsers.length === 0 ? (
                            <tr><td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-400">No users yet</td></tr>
                        ) : data.recentUsers.map(u => (
                            <tr key={u.id} className="hover:bg-gray-50">
                                <td className="whitespace-nowrap px-6 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-rose-400 text-sm font-bold text-white">
                                            {(u.name ?? u.phone ?? 'U')[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{u.name ?? '—'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-3">
                                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${
                                        u.role === 'SUPER_ADMIN' ? 'bg-red-50 text-red-700 ring-red-100' :
                                        u.role === 'ADMIN' ? 'bg-purple-50 text-purple-700 ring-purple-100' :
                                        u.role === 'VENDOR' ? 'bg-blue-50 text-blue-700 ring-blue-100' :
                                        'bg-gray-50 text-gray-600 ring-gray-100'
                                    }`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-6 py-3 text-sm text-gray-600">{u.phone}</td>
                                <td className="whitespace-nowrap px-6 py-3 text-sm text-gray-500">
                                    {new Date(u.createdAt).toLocaleDateString()}
                                </td>
                                <td className="whitespace-nowrap px-6 py-3 text-right">
                                    <button className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                                        <Edit className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
