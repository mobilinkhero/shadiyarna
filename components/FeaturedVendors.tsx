import { Star, MapPin, Users, Award } from 'lucide-react'
import Link from 'next/link'

const featuredVendors = [
    {
        id: 1,
        name: 'Elegant Weddings',
        category: 'Wedding Planner',
        rating: 4.9,
        reviewCount: 128,
        location: 'Karachi',
        price: 'PKR 150,000+',
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        featured: true
    },
    {
        id: 2,
        name: 'Golden Moments Photography',
        category: 'Photographer',
        rating: 4.8,
        reviewCount: 89,
        location: 'Lahore',
        price: 'PKR 80,000+',
        image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        featured: true
    },
    {
        id: 3,
        name: 'Royal Catering',
        category: 'Catering Service',
        rating: 4.7,
        reviewCount: 156,
        location: 'Islamabad',
        price: 'PKR 200,000+',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        featured: false
    },
    {
        id: 4,
        name: 'Blissful Decor',
        category: 'Decor & Flowers',
        rating: 4.9,
        reviewCount: 67,
        location: 'Karachi',
        price: 'PKR 120,000+',
        image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        featured: true
    },
    {
        id: 5,
        name: 'Melody Band',
        category: 'Entertainment',
        rating: 4.6,
        reviewCount: 45,
        location: 'Lahore',
        price: 'PKR 90,000+',
        image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        featured: false
    },
    {
        id: 6,
        name: 'Glamour Studio',
        category: 'Makeup & Hair',
        rating: 4.8,
        reviewCount: 92,
        location: 'Islamabad',
        price: 'PKR 50,000+',
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        featured: true
    }
]

export default function FeaturedVendors() {
    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <div className="mb-12 text-center">
                    <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                        Featured Wedding Vendors
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-gray-600">
                        Discover top-rated wedding vendors trusted by thousands of couples
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {featuredVendors.map((vendor) => (
                        <div
                            key={vendor.id}
                            className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={vendor.image}
                                    alt={vendor.name}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                {vendor.featured && (
                                    <div className="absolute left-4 top-4 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white">
                                        Featured
                                    </div>
                                )}
                                <div className="absolute bottom-4 right-4 rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-gray-900 backdrop-blur-sm">
                                    {vendor.price}
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="mb-4 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{vendor.name}</h3>
                                        <p className="text-gray-600">{vendor.category}</p>
                                    </div>
                                    <div className="flex items-center rounded-full bg-amber-50 px-3 py-1">
                                        <Star className="mr-1 h-4 w-4 fill-amber-500 text-amber-500" />
                                        <span className="font-semibold text-gray-900">{vendor.rating}</span>
                                        <span className="ml-1 text-sm text-gray-600">({vendor.reviewCount})</span>
                                    </div>
                                </div>

                                <div className="mb-6 space-y-2">
                                    <div className="flex items-center text-gray-600">
                                        <MapPin className="mr-2 h-4 w-4" />
                                        <span>{vendor.location}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Users className="mr-2 h-4 w-4" />
                                        <span>Available for booking</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <button className="rounded-lg bg-amber-600 px-4 py-2 font-medium text-white hover:bg-amber-700">
                                        View Details
                                    </button>
                                    <button className="rounded-lg border border-amber-600 px-4 py-2 font-medium text-amber-600 hover:bg-amber-50">
                                        Contact
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Link
                        href="/vendors"
                        className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
                    >
                        View All Vendors
                        <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    )
}