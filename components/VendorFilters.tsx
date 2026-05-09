'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'

interface Category { id: string; name: string; slug: string }

interface Props {
    categories: Category[]
    cities: string[]
    currentCity?: string
    currentCategory?: string
    currentSearch?: string
    currentVerified?: string
}

export default function VendorFilters({ categories, cities, currentCity, currentCategory, currentSearch, currentVerified }: Props) {
    const router = useRouter()
    const pathname = usePathname()
    const [isPending, startTransition] = useTransition()
    const [search, setSearch] = useState(currentSearch || '')

    function applyFilter(key: string, value: string | undefined) {
        const params = new URLSearchParams()
        if (currentSearch) params.set('search', currentSearch)
        if (currentCity) params.set('city', currentCity)
        if (currentCategory) params.set('category', currentCategory)
        if (currentVerified) params.set('verified', currentVerified)
        params.delete('page')

        if (value) params.set(key, value)
        else params.delete(key)

        startTransition(() => router.push(`${pathname}?${params.toString()}`))
    }

    function handleSearch(e: React.FormEvent) {
        e.preventDefault()
        applyFilter('search', search || undefined)
    }

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-6">
            <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-gray-500" />
                <h2 className="font-semibold text-gray-900">Filters</h2>
                {isPending && <span className="ml-auto text-xs text-amber-600">Loading…</span>}
            </div>

            {/* Search */}
            <form onSubmit={handleSearch}>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Search</label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Vendor name, city…"
                        className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                </div>
                <button type="submit" className="mt-2 w-full rounded-lg bg-amber-600 py-2 text-sm font-medium text-white hover:bg-amber-700">
                    Search
                </button>
            </form>

            {/* City */}
            <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">City</label>
                <select
                    value={currentCity || ''}
                    onChange={e => applyFilter('city', e.target.value || undefined)}
                    className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-amber-500 focus:outline-none"
                >
                    <option value="">All Cities</option>
                    {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                    ))}
                </select>
            </div>

            {/* Category */}
            <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Category</label>
                <select
                    value={currentCategory || ''}
                    onChange={e => applyFilter('category', e.target.value || undefined)}
                    className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-amber-500 focus:outline-none"
                >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.slug}>{cat.name}</option>
                    ))}
                </select>
            </div>

            {/* Verified */}
            <div className="flex items-center gap-2">
                <input
                    id="verified"
                    type="checkbox"
                    checked={currentVerified === 'true'}
                    onChange={e => applyFilter('verified', e.target.checked ? 'true' : undefined)}
                    className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="verified" className="text-sm text-gray-700">Verified vendors only</label>
            </div>

            {/* Clear */}
            {(currentCity || currentCategory || currentSearch || currentVerified) && (
                <button
                    onClick={() => startTransition(() => router.push(pathname))}
                    className="w-full rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                    Clear All Filters
                </button>
            )}
        </div>
    )
}
