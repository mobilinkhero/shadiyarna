import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="border-t bg-white">
            <div className="container mx-auto px-4 py-10">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#B8860B] to-[#D4A017]">
                                <span className="text-base font-bold italic text-white">S</span>
                            </div>
                            <span className="text-lg font-bold text-gray-900">Shadiyarana</span>
                        </div>
                        <p className="mt-3 text-sm text-gray-500">Pakistan&apos;s trusted wedding planning platform.</p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="mb-3 text-sm font-semibold text-gray-900">Quick Links</h3>
                        <ul className="space-y-2 text-sm text-gray-500">
                            {[['/', 'Home'], ['/vendors', 'Vendors'], ['/categories', 'Categories'], ['/about', 'About'], ['/bookings', 'My Bookings']].map(([href, label]) => (
                                <li key={href}><Link href={href} className="hover:text-[#B8860B]">{label}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="mb-3 text-sm font-semibold text-gray-900">Categories</h3>
                        <ul className="space-y-2 text-sm text-gray-500">
                            {[['venues', 'Venues'], ['photography', 'Photography'], ['catering', 'Catering'], ['makeup', 'Makeup & Hair'], ['decor', 'Decor']].map(([slug, label]) => (
                                <li key={slug}><Link href={`/vendors?category=${slug}`} className="hover:text-[#B8860B]">{label}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="mb-3 text-sm font-semibold text-gray-900">Contact</h3>
                        <div className="space-y-2 text-sm text-gray-500">
                            <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#B8860B]" /> Karachi, Pakistan</div>
                            <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-[#B8860B]" /> +92 300 1234567</div>
                            <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-[#B8860B]" /> info@shadiyarana.com</div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 border-t pt-6 text-center text-xs text-gray-400">
                    © {new Date().getFullYear()} Shadiyarana. All rights reserved.
                </div>
            </div>
        </footer>
    )
}
