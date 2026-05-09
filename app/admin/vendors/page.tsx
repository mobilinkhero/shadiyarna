import { prisma } from '@/lib/prisma'
import { CheckCircle, XCircle, Star, Building2 } from 'lucide-react'
import Link from 'next/link'

interface SearchParams { page?: string; search?: string; verified?: string }

export default async function AdminVendorsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const sp = await searchParams
    const page = Math.max(1, parseInt(sp.page || '1'))
    const limit = 20
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (sp.search) where.OR = [{ name: { contains: sp.search } }, { city: { contains: sp.search } }]
    if (sp.verified === 'true') where.isVerified = true
    if (sp.verified === 'false') where.isVerified = false

    const [total, vendors] = await Promise.all([
        prisma.vendor.count({ where }),
        prisma.vendor.findMany({
            where, skip, take: limit,
            include: {
                categories: { include: { category: true } },
                _count: { select: { bookings: true, reviews: true } },
            },
            orderBy: { createdAt: 'desc' },
        }),
    ])

    const totalPages = Math.ceil(total / limit)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Vendors</h1>
                    <p className="text-gray-600">{total} total vendors</p>
                </div>
                <Link href="/admin/vendors/new" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    + Add Vendor
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 rounded-xl border bg-white p-4 shadow-sm">
                <form className="flex gap-2">
                    <input name="search" defaultValue={sp.search} placeholder="Search vendors…" className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
                    <select name="verified" defaultValue={sp.verified || ''} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none">
                        <option value="">All</option>
                        <option value="true">Verified</option>
                        <option value="false">Pending</option>
                    </select>
                    <button type="submit" className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">Filter</button>
                </form>
            </div>

            <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {['Vendor', 'Category', 'City', 'Rating', 'Bookings', 'Status', 'Actions'].map(h => (
                                <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {vendors.map((v) => (
                            <tr key={v.id} className="hover:bg-gray-50">
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                                            <Building2 className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{v.name}</p>
                                            <p className="text-xs text-gray-500">{v.slug}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-600">{v.categories[0]?.category.name ?? '—'}</td>
                                <td className="px-4 py-4 text-sm text-gray-600">{v.city}</td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                                        <span className="text-sm font-medium">{v.rating.toFixed(1)}</span>
                                        <span className="text-xs text-gray-400">({v._count.reviews})</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-600">{v._count.bookings}</td>
                                <td className="px-4 py-4">
                                    {v.isVerified ? (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                            <CheckCircle className="h-3 w-3" /> Verified
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                                            <XCircle className="h-3 w-3" /> Pending
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex gap-2">
                                        <Link href={`/admin/vendors/${v.id}`} className="rounded-lg border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50">Edit</Link>
                                        <Link href={`/vendors/${v.slug}`} target="_blank" className="rounded-lg border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50">View</Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {vendors.length === 0 && (
                    <div className="py-12 text-center text-sm text-gray-500">No vendors found.</div>
                )}
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    {page > 1 && <Link href={`?page=${page - 1}`} className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">Previous</Link>}
                    <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
                    {page < totalPages && <Link href={`?page=${page + 1}`} className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">Next</Link>}
                </div>
            )}
        </div>
    )
}
