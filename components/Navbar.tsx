'use client'

import { Search, User, Heart, ShoppingBag, Menu, X, Bell, MapPin, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Navbar() {
    const router = useRouter()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [city, setCity] = useState('Lahore')
    const [showCityPicker, setShowCityPicker] = useState(false)

    const cities = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan']

    function handleSearch(e: React.FormEvent) {
        e.preventDefault()
        const params = new URLSearchParams()
        if (search) params.set('search', search)
        if (city) params.set('city', city)
        router.push(`/vendors?${params.toString()}`)
    }

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center gap-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 shrink-0">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#B8860B] to-[#D4A017] shadow-sm">
                            <span className="text-lg font-bold italic text-white">S</span>
                        </div>
                        <span className="hidden text-lg font-bold text-gray-900 sm:block">Shadiyarana</span>
                    </Link>

                    {/* City picker */}
                    <div className="relative hidden md:block">
                        <button
                            onClick={() => setShowCityPicker(!showCityPicker)}
                            className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm"
                        >
                            <MapPin className="h-3.5 w-3.5 text-[#B8860B]" />
                            <span className="font-medium text-gray-700">{city}</span>
                            <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                        </button>
                        {showCityPicker && (
                            <div className="absolute top-full left-0 mt-1 w-40 rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
                                {cities.map(c => (
                                    <button key={c} onClick={() => { setCity(c); setShowCityPicker(false) }}
                                        className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${c === city ? 'font-semibold text-[#B8860B]' : 'text-gray-700'}`}>
                                        {c}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Search bar */}
                    <form onSubmit={handleSearch} className="flex flex-1 items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
                        <Search className="h-4 w-4 shrink-0 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search venues, photographers..."
                            className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
                        />
                    </form>

                    {/* Nav links — desktop */}
                    <nav className="hidden items-center gap-1 lg:flex">
                        <Link href="/vendors" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#B8860B]">Vendors</Link>
                        <Link href="/categories" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#B8860B]">Categories</Link>
                        <Link href="/about" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#B8860B]">About</Link>
                    </nav>

                    {/* Right icons */}
                    <div className="flex items-center gap-1">
                        <Link href="/wishlist" className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-[#E91E8C]">
                            <Heart className="h-5 w-5" />
                        </Link>
                        <Link href="/bookings" className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-[#B8860B]">
                            <ShoppingBag className="h-5 w-5" />
                        </Link>
                        <Link href="/login" className="rounded-full p-2 text-gray-500 hover:bg-gray-100">
                            <User className="h-5 w-5" />
                        </Link>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="rounded-full p-2 text-gray-500 hover:bg-gray-100 lg:hidden">
                            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className="border-t py-3 lg:hidden">
                        <div className="space-y-1">
                            {[['/', 'Home'], ['/vendors', 'Vendors'], ['/categories', 'Categories'], ['/bookings', 'My Bookings'], ['/about', 'About']].map(([href, label]) => (
                                <Link key={href} href={href} onClick={() => setIsMenuOpen(false)}
                                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    {label}
                                </Link>
                            ))}
                            <div className="pt-2">
                                <Link href="/login" onClick={() => setIsMenuOpen(false)}
                                    className="block w-full rounded-xl bg-[#B8860B] px-4 py-3 text-center text-sm font-semibold text-white">
                                    Login / Register
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}
