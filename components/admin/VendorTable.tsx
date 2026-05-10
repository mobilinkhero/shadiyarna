'use client'

import { CheckCircle, Clock, Star, Eye } from 'lucide-react'
import Link from 'next/link'

interface VendorRow {
    id: string
    name: string
    slug?: string
    city: string
    imageUrl?: string
    rating: number
    totalReviews: number
    isVerified: boolean
    categories: { category: { name: string } }[]
    _count: { bookings: number; reviews: number }
}

export default function VendorTable({ vendors = [] }: { vendors?: VendorRow[] }) {
    if (vendors.length === 0) {
        return <div className="py-8 text-center text-sm text-gray-400">No vendors yet</div>
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full">
                <thead>
                    <tr className="border-b border-gray-100">
                        {['Vendor', 'Category', 'Rating', 'Status', ''].map(h => (
                            <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {vendors.map(v => (
                        <tr key={v.id} className="hover:bg-gray-50">
                            <td className="whitespace-nowrap px-4 py-3">
                                <div className="flex items-center gap-3">
                                    {v.imageUrl ? (
                                        <img src={v.imageUrl} alt="" className="h-9 w-9 rounded-lg object-cover" />
                                    ) : (
                                        <div className="h-9 w-9 rounded-lg bg-gray-100" />
                                    )}
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{v.name}</p>
                                        <p className="text-xs text-gray-500">{v.city} · {v._count.bookings} bookings</p>
                                    </div>
                                </div>
                            </td>
                            <td className="whitespace-nowrap px-4 py-3">
                                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                                    {v.categories[0]?.category.name ?? '—'}
                                </span>
                            </td>
                            <td className="whitespace-nowrap px-4 py-3">
                                <div className="flex items-center gap-1 text-sm">
                                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                    <span className="font-semibold text-gray-800">{v.rating.toFixed(1)}</span>
                                    <span className="text-xs text-gray-400">({v.totalReviews})</span>
                                </div>
                            </td>
                            <td className="whitespace-nowrap px-4 py-3">
                                {v.isVerified ? (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 ring-1 ring-green-100">
                                        <CheckCircle className="h-3 w-3" /> Verified
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-amber-100">
                                        <Clock className="h-3 w-3" /> Pending
                                    </span>
                                )}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3">
                                <Link href={`/admin/vendors/${v.id}`} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                                    <Eye className="h-4 w-4" />
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
