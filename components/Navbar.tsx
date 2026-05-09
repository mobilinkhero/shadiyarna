'use client'

import { Search, User, Heart, ShoppingBag, Menu, X } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

const categories = [
    { name: 'Venues', href: '/categories/venues' },
    { name: 'Photography', href: '/categories/photography' },
    { name: 'Catering', href: '/categories/catering' },
    { name: 'Makeup & Hair', href: '/categories/makeup-hair' },
    { name: 'Entertainment', href: '/categories/entertainment' },
    { name: 'Decor', href: '/categories/decor' },
    { name: 'Invitations', href: '/categories/invitations' },
    { name: 'Transport', href: '/categories/transport' },
]

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto px-4">
                {/* Top bar */}
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
                        >
                            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-600">
                                <span className="text-lg font-bold text-white">S</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900">Shadiyarana</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-6">
                        <Link href="/" className="text-sm font-medium text-gray-700 hover:text-amber-600">
                            Home
                        </Link>
                        <Link href="/vendors" className="text-sm font-medium text-gray-700 hover:text-amber-600">
                            Vendors
                        </Link>
                        <div className="relative group">
                            <button className="text-sm font-medium text-gray-700 hover:text-amber-600 flex items-center">
                                Categories
                                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <div className="absolute top-full left-0 mt-2 w-48 rounded-lg border bg-white py-2 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                {categories.map((category) => (
                                    <Link
                                        key={category.name}
                                        href={category.href}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        {category.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-amber-600">
                            About
                        </Link>
                        <Link href="/contact" className="text-sm font-medium text-gray-700 hover:text-amber-600">
                            Contact
                        </Link>
                    </nav>

                    {/* Right side icons */}
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="rounded-full p-2 hover:bg-gray-100"
                        >
                            <Search className="h-5 w-5 text-gray-600" />
                        </button>
                        <Link href="/wishlist" className="rounded-full p-2 hover:bg-gray-100">
                            <Heart className="h-5 w-5 text-gray-600" />
                        </Link>
                        <Link href="/bookings" className="rounded-full p-2 hover:bg-gray-100">
                            <ShoppingBag className="h-5 w-5 text-gray-600" />
                        </Link>
                        <Link href="/login" className="rounded-full p-2 hover:bg-gray-100">
                            <User className="h-5 w-5 text-gray-600" />
                        </Link>
                        <Link
                            href="/vendor-register"
                            className="hidden sm:inline-flex items-center rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
                        >
                            List Your Business
                        </Link>
                    </div>
                </div>

                {/* Search bar */}
                {isSearchOpen && (
                    <div className="pb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                            <input
                                type="search"
                                placeholder="Search for venues, photographers, caterers..."
                                className="w-full rounded-full border border-gray-300 py-3 pl-10 pr-4 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                                autoFocus
                            />
                        </div>
                    </div>
                )}

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className="border-t py-4 lg:hidden">
                        <div className="space-y-1">
                            <Link
                                href="/"
                                className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                href="/vendors"
                                className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Vendors
                            </Link>
                            <div className="px-3 py-2">
                                <p className="mb-2 text-sm font-medium text-gray-900">Categories</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {categories.map((category) => (
                                        <Link
                                            key={category.name}
                                            href={category.href}
                                            className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {category.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            <Link
                                href="/about"
                                className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                About
                            </Link>
                            <Link
                                href="/contact"
                                className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Contact
                            </Link>
                            <div className="pt-4">
                                <Link
                                    href="/vendor-register"
                                    className="block w-full rounded-lg bg-amber-600 px-4 py-3 text-center font-medium text-white hover:bg-amber-700"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    List Your Business
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}