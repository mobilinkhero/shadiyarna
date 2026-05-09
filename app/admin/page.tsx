import {
    Users,
    Building2,
    Calendar,
    DollarSign,
} from 'lucide-react'
import StatCard from '@/components/admin/StatCard'
import RecentActivity from '@/components/admin/RecentActivity'
import VendorTable from '@/components/admin/VendorTable'
import { prisma } from '@/lib/prisma'

async function getDashboardStats() {
    const [userCount, vendorCount, bookingCount, pendingBookings, recentBookings] =
        await Promise.all([
            prisma.user.count({ where: { isActive: true } }),
            prisma.vendor.count(),
            prisma.booking.count(),
            prisma.booking.count({ where: { status: 'PENDING' } }),
            prisma.booking.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { name: true } },
                    vendor: { select: { name: true } },
                },
            }),
        ])

    return { userCount, vendorCount, bookingCount, pendingBookings, recentBookings }
}

async function getRecentVendors() {
    return prisma.vendor.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
            categories: { include: { category: true } },
            _count: { select: { bookings: true, reviews: true } },
        },
    })
}

export default async function AdminDashboard() {
    const [stats, recentVendors] = await Promise.all([
        getDashboardStats(),
        getRecentVendors(),
    ])

    const statCards = [
        {
            title: 'Total Users',
            value: stats.userCount.toLocaleString(),
            change: 'Active accounts',
            icon: Users,
            color: 'bg-blue-500',
            trend: 'up' as const,
        },
        {
            title: 'Total Vendors',
            value: stats.vendorCount.toLocaleString(),
            change: 'Registered vendors',
            icon: Building2,
            color: 'bg-green-500',
            trend: 'up' as const,
        },
        {
            title: 'Total Bookings',
            value: stats.bookingCount.toLocaleString(),
            change: `${stats.pendingBookings} pending`,
            icon: Calendar,
            color: 'bg-purple-500',
            trend: 'up' as const,
        },
        {
            title: 'Pending Bookings',
            value: stats.pendingBookings.toLocaleString(),
            change: 'Awaiting confirmation',
            icon: DollarSign,
            color: 'bg-amber-500',
            trend: 'up' as const,
        },
    ]

    const activities = stats.recentBookings.map((b) => ({
        id: b.id,
        user: b.user.name || 'Unknown User',
        action: `Booking ${b.status.toLowerCase()}`,
        target: b.vendor.name,
        time: new Date(b.createdAt).toLocaleString(),
        icon: Calendar,
        color: b.status === 'CONFIRMED'
            ? 'text-green-600 bg-green-100'
            : b.status === 'CANCELLED'
                ? 'text-red-600 bg-red-100'
                : 'text-blue-600 bg-blue-100',
    }))

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Live data from your platform.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Vendors</h2>
                    </div>
                    <VendorTable vendors={recentVendors} />
                </div>

                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
                    </div>
                    <RecentActivity activities={activities} />
                </div>
            </div>

            <div className="rounded-xl border bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <button className="flex flex-col items-center justify-center rounded-lg border border-gray-300 p-4 transition-colors hover:border-blue-500 hover:bg-blue-50">
                        <Users className="mb-2 h-8 w-8 text-gray-600" />
                        <span className="text-sm font-medium">Add User</span>
                    </button>
                    <button className="flex flex-col items-center justify-center rounded-lg border border-gray-300 p-4 transition-colors hover:border-green-500 hover:bg-green-50">
                        <Building2 className="mb-2 h-8 w-8 text-gray-600" />
                        <span className="text-sm font-medium">Add Vendor</span>
                    </button>
                    <button className="flex flex-col items-center justify-center rounded-lg border border-gray-300 p-4 transition-colors hover:border-purple-500 hover:bg-purple-50">
                        <Calendar className="mb-2 h-8 w-8 text-gray-600" />
                        <span className="text-sm font-medium">View Bookings</span>
                    </button>
                    <button className="flex flex-col items-center justify-center rounded-lg border border-gray-300 p-4 transition-colors hover:border-amber-500 hover:bg-amber-50">
                        <DollarSign className="mb-2 h-8 w-8 text-gray-600" />
                        <span className="text-sm font-medium">Revenue Report</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
