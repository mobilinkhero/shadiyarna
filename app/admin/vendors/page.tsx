'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle, XCircle, Star, Building2, Edit, Trash2, ExternalLink, Search, Filter } from 'lucide-react'
import PageHeader from '@/components/admin/PageHeader'
import ConfirmDelete from '@/components/admin/ConfirmDelete'

interface Vendor {
    id: string; name: string; slug: string; city: string; imageUrl: string
    rating: number; totalReviews: number
    isVerified: boolean; isFeatured: boolean
    categories: { category: { name: string } }[]
    _count: { bookings: number; reviews: number }
}

function getToken() {
    return typeof document !== 'undefined' ? document.cookie.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1] ?? '' : ''
}

export default function AdminVendorsPage() {
    const [vendors, setVendors] = useState<Vendor[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [verified, setVerified] = useState('')
    const [deleting, setDeleting] = useState<Vendor | null>(null)

    async function load() {
        setLoading(true)
        try {
            const params = new URLSearchParams({ limit: '100' })
            if (search) params.set('search', search)
            if (verified) params.set('isVerified', verified)
            const res = await fetch(`/api/vendors?${params}`)
            const json = await res.json()
            if (json.success || json.data) setVendors(json.data ?? [])
        } finally { setLoading(false) }
    }

    useEffect(() => { load() }, [verified])

    async function handleDelete(v: Vendor) {
        await fetch(`/api/vendors/${v.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${getToken()}` } })
        load()
    }

    const filtered = vendors.filter(v => !search || v.name.toLowerCase().includes(search.toLowerCase()) || v.city.toLowerCase().includes(search.toLowerCase()))

    return (
        <div>
            <PageHeader title="Vendors" description={`${vendors.length} total vendors`} actionLabel="Add Vendor" actionHref="/admin/vendors/new" />

            {/* Filters */}
            <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-3">
                <div className="flex flex-1 items-center gap-2 min-w-[200px]">
                    <Search className="h-4 w-4 text-gray-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or city..."
                        className="flex-1 bg-transparent text-sm outline-none" />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <select value={verified} onChange={e => setVerified(e.target.value)}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm outline-none">
                        <option value="">All statuses</option>
                        <option value="true">Verified</option>
                        <option value="false">Pending</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            {['Vendor', 'Category', 'City', 'Rating', 'Bookings', 'Status', ''].map(h => (
                                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-gray-400">Loading...</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={7} className="px-4 py-16 text-center">
                                <Building2 className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                                <p className="text-sm font-medium text-gray-700">No vendors found</p>
                                <p className="mt-1 text-xs text-gray-400">Add your first vendor to get started</p>
                            </td></tr>
                        ) : filtered.map(v => (
                            <tr key={v.id} className="hover:bg-gray-50">
                                <td className="whitespace-nowrap px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        {v.imageUrl ? (
                                            <img src={v.imageUrl} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                                        ) : (
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                                                <Building2 className="h-5 w-5 text-gray-400" />
                                            </div>
                                        )}
                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <p className="font-medium text-gray-900">{v.name}</p>
                                                {v.isFeatured && (
                                                    <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">★ FEATURED</span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500">{v.slug}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-4 py-3">
                                    <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                                        {v.categories[0]?.category.name ?? '—'}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{v.city}</td>
                                <td className="whitespace-nowrap px-4 py-3">
                                    <div className="flex items-center gap-1">
                                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                        <span className="text-sm font-semibold text-gray-800">{v.rating.toFixed(1)}</span>
                                        <span className="text-xs text-gray-400">({v.totalReviews})</span>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{v._count.bookings}</td>
                                <td className="whitespace-nowrap px-4 py-3">
                                    {v.isVerified ? (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 ring-1 ring-green-200">
                                            <CheckCircle className="h-3 w-3" /> Verified
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
                                            <XCircle className="h-3 w-3" /> Pending
                                        </span>
                                    )}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <Link href={`/vendors/${v.slug}`} target="_blank" title="View public page"
                                            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                                            <ExternalLink className="h-4 w-4" />
                                        </Link>
                                        <Link href={`/admin/vendors/${v.id}`} title="Edit"
                                            className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600">
                                            <Edit className="h-4 w-4" />
                                        </Link>
                                        <button onClick={() => setDeleting(v)} title="Delete"
                                            className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {deleting && (
                <ConfirmDelete open={true} onClose={() => setDeleting(null)}
                    onConfirm={async () => { await handleDelete(deleting) }}
                    title="Delete vendor"
                    message={`Delete "${deleting.name}"? This will remove all their packages, addons, reviews, and bookings.`}
                />
            )}
        </div>
    )
}
