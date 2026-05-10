import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="border-t border-[#EBEBEB] bg-white">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#B8860B] to-[#D4A017]">
                                <span className="text-sm font-bold italic text-white">S</span>
                            </div>
                            <span className="text-lg font-bold text-gray-900">Shadiyarana</span>
                        </div>
                        <p className="mt-4 text-sm leading-relaxed text-gray-500">
                            Pakistan&apos;s trusted wedding planning platform. Find verified vendors for your perfect day.
                        </p>
                    </div>

                    {/* Quick links */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold text-gray-900">Quick Links</h3>
                        <ul className="space-y-2.5 text-sm text-gray-500">
                            {[['/', 'Home'], ['/vendors', 'All Vendors'], ['/categories', 'Categories'], ['/bookings', 'My Bookings'], ['/about', 'About Us']].map(([href, label]) => (
                                <li key={href}><Link href={href} className="hover:text-[#B8860B] transition-colors">{label}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold text-gray-900">Categories</h3>
                        <ul className="space-y-2.5 text-sm text-gray-500">
                            {[['venues', 'Wedding Venues'], ['photography', 'Photography'], ['catering', 'Catering'], ['makeup', 'Makeup & Hair'], ['decor', 'Decor & Flowers'], ['entertainment', 'Entertainment']].map(([slug, label]) => (
                                <li key={slug}><Link href={`/vendors?category=${slug}`} className="hover:text-[#B8860B] transition-colors">{label}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold text-gray-900">Contact Us</h3>
                        <div className="space-y-3 text-sm text-gray-500">
                            <div className="flex items-center gap-2.5"><MapPin className="h-4 w-4 shrink-0 text-[#B8860B]" /> Karachi, Pakistan</div>
                            <div className="flex items-center gap-2.5"><Phone className="h-4 w-4 shrink-0 text-[#B8860B]" /> +92 300 1234567</div>
                            <div className="flex items-center gap-2.5"><Mail className="h-4 w-4 shrink-0 text-[#B8860B]" /> info@shadiyarana.com</div>
                        </div>

                        {/* Newsletter */}
                        <div className="mt-6">
                            <p className="mb-2 text-sm font-medium text-gray-700">Subscribe to Newsletter</p>
                            <div className="flex overflow-hidden rounded-xl border border-[#EBEBEB]">
                                <input type="email" placeholder="Your email"
                                    className="flex-1 bg-white px-3 py-2.5 text-sm outline-none placeholder-gray-400" />
                                <button className="bg-[#B8860B] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#D4A017] transition-colors">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-10 border-t border-[#EBEBEB] pt-6 text-center text-sm text-gray-400">
                    © {new Date().getFullYear()} Shadiyarana. All rights reserved.
                </div>
            </div>
        </footer>
    )
}
