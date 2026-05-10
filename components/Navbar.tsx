'use client'

import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const categoryLinks = [
    { name: 'Venues', slug: 'venues' },
    { name: 'Photography', slug: 'photography' },
    { name: 'Catering', slug: 'catering' },
    { name: 'Makeup & Hair', slug: 'makeup' },
    { name: 'Decor', slug: 'decor' },
    { name: 'Entertainment', slug: 'entertainment' },
]

export default function Navbar() {
    const router = useRouter()
    const [search, setSearch] = useState('')
    const [mobileOpen, setMobileOpen] = useState(false)
    const [catOpen, setCatOpen] = useState(false)

    function handleSearch(e: React.FormEvent) {
        e.preventDefault()
        if (search.trim()) router.push(`/vendors?search=${encodeURIComponent(search.trim())}`)
    }

    return (
        <header className="sticky top-0 z-50 border-b border-[#EBEBEB] bg-white/95 backdrop-blur-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="flex h-16 items-center gap-6">

                    {/* Logo */}
                    <Link href="/" className="flex shrink-0 items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#B8860B] to-[#D4A017]">
                            <span className="text-sm font-bold italic text-white">S</span>
                        </div>
                        <span className="text-lg font-bold tracking-tight text-gray-900">Shadiyarana</span>
                    </Link>

                    {/* Nav — desktop */}
                    <nav className="hidden items-center gap-1 lg:flex">
                        <Link href="/vendors" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#B8860B] transition-colors">
                            Vendors
                        </Link>

                        {/* Categories dropdown */}
                        <div className="relative" onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
                            <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#B8860B] transition-colors">
                                Categories <ChevronDown className="h-3.5 w-3.5" />
                            </button>
                            {catOpen && (
                                <div className="absolute top-full left-0 mt-1 w-48 rounded-xl border border-[#EBEBEB] bg-white py-1.5 shadow-lg">
                                    {categoryLinks.map(c => (
                                        <Link key={c.slug} href={`/vendors?category=${c.slug}`}
                                            className="block px-4 py-2 text-sm text-gray-600 hover:bg-[#FFF8EE] hover:text-[#B8860B] transition-colors">
                                            {c.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Link href="/about" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#B8860B] transition-colors">
                            About
                        </Link>
                    </nav>

                    {/* Right actions */}
                    <div className="ml-auto flex items-center gap-1">
                        <Link href="/wishlist" className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-[#E91E8C] transition-colors" title="Wishlist">
                            <Heart className="h-5 w-5" />
                        </Link>
                        <Link href="/bookings" className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-[#B8860B] transition-colors" title="Bookings">
                            <ShoppingBag className="h-5 w-5" />
                        </Link>
                        <Link href="/login"
                            className="hidden items-center gap-2 rounded-xl border border-[#EBEBEB] px-4 py-2 text-sm font-medium text-gray-700 hover:border-[#B8860B] hover:text-[#B8860B] transition-colors sm:flex">
                            <User className="h-4 w-4" /> Login
                        </Link>
                        <button onClick={() => setMobileOpen(!mobileOpen)} className="rounded-full p-2 text-gray-500 hover:bg-gray-100 lg:hidden">
                            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileOpen && (
                    <div className="border-t border-[#EBEBEB] py-4 lg:hidden">
                        <form onSubmit={handleSearch} className="mb-3">
                            <div className="flex items-center gap-2 rounded-xl border border-[#EBEBEB] bg-[#F8F7F4] px-4 py-2.5">
                                <Search className="h-4 w-4 text-gray-400" />
                                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                                    placeholder="Search..." className="flex-1 bg-transparent text-sm outline-none" />
                            </div>
                        </form>
                        <div className="space-y-1">
                            {[['/', 'Home'], ['/vendors', 'Vendors'], ['/categories', 'Categories'], ['/bookings', 'My Bookings'], ['/about', 'About'], ['/login', 'Login']].map(([href, label]) => (
                                <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}
