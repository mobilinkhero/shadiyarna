import { prisma } from '@/lib/prisma'
import { Star } from 'lucide-react'
import Link from 'next/link'

interface SearchParams { page?: string }

export default async function AdminReviewsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const sp = await searchParams
    const page = Math.max(1, parseInt(sp.page || '1'))
    const limit = 20
    const skip = (page - 1) * limit

    const [total, reviews] = await Promise.all([
        prisma.review.count(),
        prisma.review.findMany({
            skip, take: limit,
            include: {
                user: { select: { id: true, name: true, phone: true } },
                vendor: { select: { id: true, name: true, slug: true } },
            },
            orderBy: { createdAt: 'desc' },
        }),
    ])

    const totalPages = Math.ceil(total / limit)

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
                <p className="text-gray-600">{total} total reviews</p>
            </div>

            <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {['User', 'Vendor', 'Rating', 'Comment', 'Date'].map(h => (
                                <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {reviews.map((r) => (
                            <tr key={r.id} className="hover:bg-gray-50">
                                <td className="px-4 py-4">
                                    <p className="text-sm font-medium text-gray-900">{r.user.name ?? '—'}</p>
                                    <p className="text-xs text-gray-500">{r.user.phone}</p>
                                </td>
                                <td className="px-4 py-4">
                                    <Link href={`/vendors/${r.vendor.slug}`} target="_blank" className="text-sm font-medium text-blue-600 hover:underline">
                                        {r.vendor.name}
                                    </Link>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`h-4 w-4 ${i < r.rating ? 'fill-amber-500 text-amber-500' : 'fill-gray-200 text-gray-200'}`} />
                                        ))}
                                    </div>
                                </td>
                                <td className="px-4 py-4 max-w-xs">
                                    <p className="text-sm text-gray-600 truncate">{r.comment ?? '—'}</p>
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-500">
                                    {new Date(r.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {reviews.length === 0 && <div className="py-12 text-center text-sm text-gray-500">No reviews yet.</div>}
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
