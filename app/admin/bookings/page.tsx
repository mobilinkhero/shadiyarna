import { prisma } from '@/lib/prisma'
import Link from 'next/link'

interface SearchParams { page?: string; status?: string }

const statusColors: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
    REJECTED: 'bg-gray-100 text-gray-800',
}

export default async function AdminBookingsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const sp = await searchParams
    const page = Math.max(1, parseInt(sp.page || '1'))
    const limit = 20
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (sp.status) where.status = sp.status

    const [total, bookings] = await Promise.all([
        prisma.booking.count({ where }),
        prisma.booking.findMany({
            where, skip, take: limit,
            include: {
                user: { select: { id: true, name: true, phone: true } },
                vendor: { select: { id: true, name: true, city: true } },
                package: { select: { id: true, name: true, price: true } },
            },
            orderBy: { createdAt: 'desc' },
        }),
    ])

    const totalPages = Math.ceil(total / limit)
    const statuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'REJECTED']

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
                <p className="text-gray-600">{total} total bookings</p>
            </div>

            {/* Status tabs */}
            <div className="flex flex-wrap gap-2">
                <Link href="/admin/bookings" className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${!sp.status ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                    All
                </Link>
                {statuses.map(s => (
                    <Link key={s} href={`/admin/bookings?status=${s}`}
                        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${sp.status === s ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                        {s.charAt(0) + s.slice(1).toLowerCase()}
                    </Link>
                ))}
            </div>

            <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {['Booking ID', 'User', 'Vendor', 'Package', 'Date', 'Status', 'Created'].map(h => (
                                <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {bookings.map((b) => (
                            <tr key={b.id} className="hover:bg-gray-50">
                                <td className="px-4 py-4 text-xs font-mono text-gray-500">{b.id.slice(0, 8)}…</td>
                                <td className="px-4 py-4">
                                    <p className="text-sm font-medium text-gray-900">{b.user.name ?? '—'}</p>
                                    <p className="text-xs text-gray-500">{b.user.phone}</p>
                                </td>
                                <td className="px-4 py-4">
                                    <p className="text-sm font-medium text-gray-900">{b.vendor.name}</p>
                                    <p className="text-xs text-gray-500">{b.vendor.city}</p>
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-600">{b.package?.name ?? '—'}</td>
                                <td className="px-4 py-4 text-sm text-gray-600">
                                    {new Date(b.date).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-4">
                                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[b.status] ?? 'bg-gray-100 text-gray-700'}`}>
                                        {b.status}
                                    </span>
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-500">
                                    {new Date(b.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {bookings.length === 0 && <div className="py-12 text-center text-sm text-gray-500">No bookings found.</div>}
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    {page > 1 && <Link href={`?${new URLSearchParams({ ...sp, page: String(page - 1) })}`} className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">Previous</Link>}
                    <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
                    {page < totalPages && <Link href={`?${new URLSearchParams({ ...sp, page: String(page + 1) })}`} className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">Next</Link>}
                </div>
            )}
        </div>
    )
}
