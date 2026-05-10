'use client'

import { Search, MapPin, ChevronRight, Shield, Star, Users } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const popularSearches = ['Wedding Venues', 'Photographers', 'Catering', 'Bridal Makeup', 'Decor']

export default function HeroSection() {
    const router = useRouter()
    const [search, setSearch] = useState('')
    const [city, setCity] = useState('')

    function handleSearch(e: React.FormEvent) {
        e.preventDefault()
        const p = new URLSearchParams()
        if (search) p.set('search', search)
        if (city) p.set('city', city)
        router.push(`/vendors?${p.toString()}`)
    }

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1a0a00] via-[#2d1200] to-[#1a0a00]">
            {/* Background image */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-20"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

            <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:py-36">
                <div className="mx-auto max-w-3xl text-center">
                    {/* Badge */}
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#B8860B]/30 bg-[#B8860B]/10 px-4 py-1.5 backdrop-blur-sm">
                        <Star className="h-3.5 w-3.5 fill-[#D4A017] text-[#D4A017]" />
                        <span className="text-sm font-medium text-[#D4A017]">Pakistan&apos;s #1 Wedding Planning Platform</span>
                    </div>

                    {/* Heading */}
                    <h1 className="mb-5 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                        Plan Your Perfect{' '}
                        <span className="bg-gradient-to-r from-[#D4A017] to-[#E91E8C] bg-clip-text text-transparent">
                            Wedding
                        </span>
                    </h1>
                    <p className="mb-10 text-lg text-gray-300">
                        Discover verified vendors, compare packages, and book everything for your special day — all in one place.
                    </p>

                    {/* Search box */}
                    <form onSubmit={handleSearch} className="mx-auto mb-6 max-w-2xl">
                        <div className="flex flex-col gap-2 rounded-2xl bg-white/10 p-2 backdrop-blur-md sm:flex-row">
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
                            <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 sm:w-44">
                                <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
                                <select value={city} onChange={e => setCity(e.target.value)}
                                    className="w-full bg-transparent text-sm text-gray-700 outline-none">
                                    <option value="">All Cities</option>
                                    {['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan'].map(c => (
                                        <option key={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit"
                                className="flex items-center justify-center gap-2 rounded-xl bg-[#B8860B] px-7 py-3 font-semibold text-white transition-all hover:bg-[#D4A017] hover:shadow-lg hover:shadow-[#B8860B]/30">
                                Search <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </form>

                    {/* Popular searches */}
                    <div className="mb-14 flex flex-wrap items-center justify-center gap-2">
                        <span className="text-sm text-gray-400">Popular:</span>
                        {popularSearches.map(term => (
                            <Link key={term} href={`/vendors?search=${encodeURIComponent(term)}`}
                                className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur-sm transition-all hover:bg-white/20">
                                {term}
                            </Link>
                        ))}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { icon: Shield, value: '2,500+', label: 'Verified Vendors' },
                            { icon: Users, value: '10,000+', label: 'Happy Couples' },
                            { icon: Star, value: '4.8 / 5', label: 'Average Rating' },
                        ].map(({ icon: Icon, value, label }) => (
                            <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                                <Icon className="mx-auto mb-2 h-5 w-5 text-[#D4A017]" />
                                <p className="text-xl font-bold text-white sm:text-2xl">{value}</p>
                                <p className="text-xs text-gray-400 sm:text-sm">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Wave */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 48L1440 48L1440 0C1200 40 960 48 720 48C480 48 240 40 0 0L0 48Z" fill="#F8F7F4" />
                </svg>
            </div>
        </section>
    )
}
