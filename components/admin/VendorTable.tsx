'use client'

import { Building2, CheckCircle, XCircle, Star, MoreVertical } from 'lucide-react'
import { useState } from 'react'

interface VendorRow {
    id: string
    name: string
    city: string
    rating: number
    totalReviews: number
    isVerified: boolean
    categories: { category: { name: string } }[]
    _count: { bookings: number; reviews: number }
}

interface Props {
    vendors?: VendorRow[]
}

export default function VendorTable({ vendors = [] }: Props) {
    const [selectedVendor, setSelectedVendor] = useState<string | null>(null)

    const getStatusBadge = (isVerified: boolean) => {
        if (isVerified) {
            return (
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Verified
                </span>
            )
        }
        return (
            <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                <XCircle className="mr-1 h-3 w-3" />
                Pending
            </span>
        )
    }

    if (vendors.length === 0) {
        return (
            <div className="py-8 text-center text-sm text-gray-500">
                No vendors yet. Add your first vendor to get started.
            </div>
        )
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Vendor</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Category</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Rating</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {vendors.map((vendor) => (
                        <tr key={vendor.id} className="hover:bg-gray-50">
                            <td className="whitespace-nowrap px-4 py-4">
                                <div className="flex items-center">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                                        <Building2 className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">{vendor.name}</div>
                                        <div className="text-sm text-gray-500">
                                            {vendor.city} · {vendor._count.bookings} bookings
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4">
                                <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800">
                                    {vendor.categories[0]?.category.name ?? '—'}
                                </span>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4">
                                <div className="flex items-center">
                                    <Star className="mr-1 h-4 w-4 fill-current text-amber-500" />
                                    <span className="text-sm font-medium text-gray-900">{vendor.rating.toFixed(1)}</span>
                                    <span className="ml-1 text-sm text-gray-500">({vendor.totalReviews})</span>
                                </div>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4">
                                {getStatusBadge(vendor.isVerified)}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4">
                                <div className="relative">
                                    <button
                                        onClick={() => setSelectedVendor(selectedVendor === vendor.id ? null : vendor.id)}
                                        className="rounded-lg p-1 hover:bg-gray-100"
                                    >
                                        <MoreVertical className="h-5 w-5 text-gray-500" />
                                    </button>
                                    {selectedVendor === vendor.id && (
                                        <div className="absolute right-0 z-10 mt-1 w-48 rounded-md border bg-white py-1 shadow-lg">
                                            <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">View Details</button>
                                            <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">Edit Vendor</button>
                                            <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">Verify Vendor</button>
                                            <button className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100">Delete</button>
                                        </div>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
