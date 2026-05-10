'use client'

import { Search, MapPin, ChevronRight, Star, Shield, Clock } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const popularSearches = ['Venues', 'Photography', 'Catering', 'Makeup', 'Decor']

export default function HeroSection() {
    const router = useRouter()
    const [search, setSearch] = useState('')
    const [city, setCity] = useState('')

    function handleSearch(e: React.FormEvent) {
        e.preventDefault()
        const params = new URLSearchParams()
        if (search) params.set('search', search)
        if (city) params.set('city', city)
        router.push(`/vendors?${params.toString()}`)
    }

    return (
        <section className="relative min-h-[92vh] overflow-hidden bg-[#0a0a0a]">
            {/* Background image with overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

            {/* Decorative elements */}
            <div className="absolute top-20 left-10 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
            <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-rose-500/10 blur-3xl" />

            <div className="relative container mx-auto px-4 py-24 md:py-36">
                <div className="mx-auto max-w-4xl text-center">
                    {/* Badge */}
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 backdrop-blur-sm">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium text-amber-300">Pakistan&apos;s #1 Wedding Planning Platform</span>
                    </div>

                    {/* Heading */}
                    <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
                        Your Dream Wedding{' '}
                        <span className="bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">
                            Starts Here
                        </span>
                    </h1>

                    <p className="mb-10 text-lg text-gray-300 md:text-xl">
                        Discover verified vendors, compare packages, and book everything for your perfect day — all in one place.
                    </p>

                    {/* Search box */}
                    <form onSubmit={handleSearch} className="mx-auto mb-6 max-w-3xl">
                        <div className="flex flex-col gap-3 rounded-2xl bg-white/10 p-3 backdrop-blur-md sm:flex-row">
                            <div className="flex flex-1 items-center gap-3 rounded-xl bg-white px-4 py-3">
                                <Search className="h-5 w-5 shrink-0 text-gray-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Venues, photographers, caterers..."
                                    className="w-full bg-transparent text-gray-900 placeholder-gray-400 outline-none"
                                />
                            </div>
                            <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 sm:w-48">
                                <MapPin className="h-5 w-5 shrink-0 text-gray-400" />
                                <select
                                    value={city}
                                    onChange={e => setCity(e.target.value)}
                                    className="w-full bg-transparent text-gray-700 outline-none"
                                >
                                    <option value="">All Cities</option>
                                    <option>Karachi</option>
                                    <option>Lahore</option>
                                    <option>Islamabad</option>
                                    <option>Rawalpindi</option>
                                    <option>Faisalabad</option>
                                    <option>Multan</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-3 font-semibold text-white shadow-lg transition-all hover:from-amber-600 hover:to-amber-700 hover:shadow-amber-500/25"
                            >
                                Search
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </form>

                    {/* Popular searches */}
                    <div className="mb-16 flex flex-wrap items-center justify-center gap-2">
                        <span className="text-sm text-gray-400">Popular:</span>
                        {popularSearches.map(term => (
                            <Link
                                key={term}
                                href={`/vendors?search=${term}`}
                                className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur-sm transition-all hover:bg-white/20"
                            >
                                {term}
                            </Link>
                        ))}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 md:gap-8">
                        {[
                            { icon: Shield, value: '2,500+', label: 'Verified Vendors' },
                            { icon: Star, value: '10,000+', label: 'Happy Couples' },
                            { icon: Clock, value: '4.8/5', label: 'Average Rating' },
                        ].map(({ icon: Icon, value, label }) => (
                            <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm md:p-6">
                                <Icon className="mx-auto mb-2 h-6 w-6 text-amber-400" />
                                <p className="text-2xl font-bold text-white md:text-3xl">{value}</p>
                                <p className="text-sm text-gray-400">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom wave */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 60L1440 60L1440 0C1440 0 1080 60 720 60C360 60 0 0 0 0L0 60Z" fill="#f9fafb" />
                </svg>
            </div>
        </section>
    )
}
