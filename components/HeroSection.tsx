import { Search, Calendar, MapPin, Users } from 'lucide-react'
import Link from 'next/link'

export default function HeroSection() {
    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-amber-50">
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            <div className="container relative mx-auto px-4 py-16 md:py-24">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                    {/* Left content */}
                    <div className="flex flex-col justify-center">
                        <div className="mb-6 inline-flex items-center rounded-full bg-amber-100 px-4 py-2">
                            <span className="text-sm font-medium text-amber-800">
                                🎉 Trusted by over 5,000+ couples
                            </span>
                        </div>
                        <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
                            Plan Your Perfect{' '}
                            <span className="bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                                Wedding
                            </span>{' '}
                            with Ease
                        </h1>
                        <p className="mb-8 text-lg text-gray-600 md:text-xl">
                            Discover the best wedding vendors, venues, and services all in one place.
                            From photography to catering, we help you create unforgettable memories.
                        </p>

                        {/* Search bar */}
                        <div className="mb-8 rounded-2xl bg-white p-2 shadow-lg">
                            <div className="flex flex-col gap-4 md:flex-row">
                                <div className="flex-1">
                                    <div className="flex items-center rounded-lg border border-gray-200 px-4 py-3">
                                        <Search className="mr-3 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search for vendors, venues, services..."
                                            className="w-full border-none bg-transparent outline-none placeholder:text-gray-400"
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center rounded-lg border border-gray-200 px-4 py-3">
                                        <MapPin className="mr-3 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Location (e.g., Karachi, Lahore)"
                                            className="w-full border-none bg-transparent outline-none placeholder:text-gray-400"
                                        />
                                    </div>
                                </div>
                                <button className="rounded-lg bg-amber-600 px-6 py-3 font-semibold text-white hover:bg-amber-700">
                                    Search
                                </button>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-6">
                            <div className="flex items-center">
                                <div className="mr-3 rounded-lg bg-amber-100 p-2">
                                    <Calendar className="h-6 w-6 text-amber-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">10,000+</p>
                                    <p className="text-sm text-gray-600">Weddings Planned</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="mr-3 rounded-lg bg-amber-100 p-2">
                                    <Users className="h-6 w-6 text-amber-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">2,500+</p>
                                    <p className="text-sm text-gray-600">Verified Vendors</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right image/illustration */}
                    <div className="relative">
                        <div className="relative h-full min-h-[400px] overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 to-amber-700 shadow-2xl">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-10"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                            {/* Floating cards */}
                            <div className="absolute left-6 top-6 rounded-2xl bg-white/90 p-4 shadow-xl backdrop-blur-sm">
                                <div className="flex items-center">
                                    <div className="mr-3 rounded-full bg-green-100 p-2">
                                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">Available Today</p>
                                        <p className="text-sm text-gray-600">15+ photographers</p>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute bottom-6 right-6 rounded-2xl bg-white/90 p-4 shadow-xl backdrop-blur-sm">
                                <div className="flex items-center">
                                    <div className="mr-3 rounded-full bg-blue-100 p-2">
                                        <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">Top Rated</p>
                                        <p className="text-sm text-gray-600">4.8/5 average rating</p>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                                <div className="rounded-2xl bg-white/20 p-6 backdrop-blur-sm">
                                    <p className="text-2xl font-bold text-white">Your Dream Wedding</p>
                                    <p className="text-amber-100">Starts Here</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}