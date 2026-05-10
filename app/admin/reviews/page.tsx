'use client'

import { useEffect, useState } from 'react'
import { Star, Trash2, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import PageHeader from '@/components/admin/PageHeader'
import ConfirmDelete from '@/components/admin/ConfirmDelete'

interface Review {
    id: string; rating: number; comment?: string | null; createdAt: string
    user: { id: string; name?: string | null; phone: string }
    vendor: { id: string; name: string; slug: string; imageUrl: string }
}

function getToken() {
    return typeof document !== 'undefined' ? document.cookie.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1] ?? '' : ''
}

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState<Review | null>(null)

    async function load() {
        setLoading(true)
        try {
            const res = await fetch('/api/admin/reviews', { headers: { Authorization: `Bearer ${getToken()}` } })
            const json = await res.json()
            if (json.success) setReviews(json.data)
        } finally { setLoading(false) }
    }

    useEffect(() => { load() }, [])

    async function handleDelete(review: Review) {
        await fetch(`/api/admin/reviews/${review.id}`, {
            method: 'DELETE', headers: { Authorization: `Bearer ${getToken()}` },
        })
        load()
    }

    return (
        <div>
            <PageHeader title="Reviews" description={`${reviews.length} customer reviews`} />

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            {['User', 'Vendor', 'Rating', 'Comment', 'Date', ''].map(h => (
                                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-400">Loading...</td></tr>
                        ) : reviews.length === 0 ? (
                            <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-400">No reviews yet</td></tr>
                        ) : reviews.map(r => (
                            <tr key={r.id} className="hover:bg-gray-50">
                                <td className="whitespace-nowrap px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-rose-400 text-xs font-bold text-white">
                                            {(r.user.name ?? r.user.phone)[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{r.user.name ?? '—'}</p>
                                            <p className="text-xs text-gray-500">{r.user.phone}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-4 py-3">
                                    <Link href={`/vendors/${r.vendor.slug}`} target="_blank" className="inline-flex items-center gap-2 hover:underline">
                                        <img src={r.vendor.imageUrl} alt="" className="h-7 w-7 rounded-lg object-cover" />
                                        <span className="text-sm font-medium text-gray-900">{r.vendor.name}</span>
                                        <ExternalLink className="h-3 w-3 text-gray-400" />
                                    </Link>
                                </td>
                                <td className="whitespace-nowrap px-4 py-3">
                                    <div className="flex items-center gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} />
                                        ))}
                                    </div>
                                </td>
                                <td className="px-4 py-3 max-w-md">
                                    <p className="truncate text-sm text-gray-600">{r.comment ?? '—'}</p>
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                    {new Date(r.createdAt).toLocaleDateString()}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-right">
                                    <button onClick={() => setDeleting(r)}
                                        className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600" title="Delete">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {deleting && (
                <ConfirmDelete open={true} onClose={() => setDeleting(null)}
                    onConfirm={async () => { await handleDelete(deleting) }}
                    title="Delete review"
                    message={`Delete this review for "${deleting.vendor.name}"? The vendor's rating will be recalculated.`}
                />
            )}
        </div>
    )
}
