import { Mail, Phone, MapPin } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="border-t bg-gray-50">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* Company info */}
                    <div>
                        <div className="flex items-center space-x-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-600">
                                <span className="text-xl font-bold text-white">S</span>
                            </div>
                            <span className="text-2xl font-bold text-gray-900">Shadiyarana</span>
                        </div>
                        <p className="mt-4 text-gray-600">
                            Your trusted partner for planning the perfect wedding. Find the best vendors, venues, and services for your special day.
                        </p>
                        <div className="mt-6 flex space-x-4">
                            <a href="#" className="rounded-full bg-white p-2 shadow-sm hover:shadow-md">
                                <span className="text-gray-600">FB</span>
                            </a>
                            <a href="#" className="rounded-full bg-white p-2 shadow-sm hover:shadow-md">
                                <span className="text-gray-600">IG</span>
                            </a>
                            <a href="#" className="rounded-full bg-white p-2 shadow-sm hover:shadow-md">
                                <span className="text-gray-600">TW</span>
                            </a>
                            <a href="#" className="rounded-full bg-white p-2 shadow-sm hover:shadow-md">
                                <Mail className="h-5 w-5 text-gray-600" />
                            </a>
                        </div>
                    </div>

                    {/* Quick links */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Quick Links</h3>
                        <ul className="mt-4 space-y-2">
                            <li>
                                <Link href="/" className="text-gray-600 hover:text-amber-600">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/vendors" className="text-gray-600 hover:text-amber-600">
                                    Vendors
                                </Link>
                            </li>
                            <li>
                                <Link href="/categories" className="text-gray-600 hover:text-amber-600">
                                    Categories
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-gray-600 hover:text-amber-600">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-gray-600 hover:text-amber-600">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-gray-600 hover:text-amber-600">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-gray-600 hover:text-amber-600">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
                        <ul className="mt-4 space-y-2">
                            <li>
                                <Link href="/categories/venues" className="text-gray-600 hover:text-amber-600">
                                    Wedding Venues
                                </Link>
                            </li>
                            <li>
                                <Link href="/categories/photography" className="text-gray-600 hover:text-amber-600">
                                    Photography
                                </Link>
                            </li>
                            <li>
                                <Link href="/categories/catering" className="text-gray-600 hover:text-amber-600">
                                    Catering Services
                                </Link>
                            </li>
                            <li>
                                <Link href="/categories/makeup-hair" className="text-gray-600 hover:text-amber-600">
                                    Makeup & Hair
                                </Link>
                            </li>
                            <li>
                                <Link href="/categories/entertainment" className="text-gray-600 hover:text-amber-600">
                                    Entertainment
                                </Link>
                            </li>
                            <li>
                                <Link href="/categories/decor" className="text-gray-600 hover:text-amber-600">
                                    Decor & Flowers
                                </Link>
                            </li>
                            <li>
                                <Link href="/categories/transport" className="text-gray-600 hover:text-amber-600">
                                    Transport
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact info */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Contact Us</h3>
                        <div className="mt-4 space-y-4">
                            <div className="flex items-start space-x-3">
                                <MapPin className="mt-1 h-5 w-5 text-amber-600" />
                                <div>
                                    <p className="font-medium text-gray-900">Address</p>
                                    <p className="text-gray-600">123 Wedding Street, Karachi, Pakistan</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone className="h-5 w-5 text-amber-600" />
                                <div>
                                    <p className="font-medium text-gray-900">Phone</p>
                                    <p className="text-gray-600">+92 300 1234567</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Mail className="h-5 w-5 text-amber-600" />
                                <div>
                                    <p className="font-medium text-gray-900">Email</p>
                                    <p className="text-gray-600">info@shadiyarana.com</p>
                                </div>
                            </div>
                        </div>

                        {/* Newsletter */}
                        <div className="mt-8">
                            <h4 className="font-medium text-gray-900">Subscribe to Newsletter</h4>
                            <div className="mt-2 flex">
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="flex-1 rounded-l-lg border border-r-0 border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                />
                                <button className="rounded-r-lg bg-amber-600 px-4 py-2 font-medium text-white hover:bg-amber-700">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-12 border-t pt-8">
                    <div className="flex flex-col items-center justify-between md:flex-row">
                        <p className="text-gray-600">
                            © {new Date().getFullYear()} Shadiyarana. All rights reserved.
                        </p>
                        <div className="mt-4 flex space-x-6 md:mt-0">
                            <Link href="/sitemap" className="text-gray-600 hover:text-amber-600">
                                Sitemap
                            </Link>
                            <Link href="/faq" className="text-gray-600 hover:text-amber-600">
                                FAQ
                            </Link>
                            <Link href="/help" className="text-gray-600 hover:text-amber-600">
                                Help Center
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}