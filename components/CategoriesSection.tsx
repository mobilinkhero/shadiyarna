import { Camera, Music, Utensils, Flower2, Car, Heart, Palette, Building } from 'lucide-react'
import Link from 'next/link'

const categories = [
    {
        id: 1,
        name: 'Photography',
        icon: Camera,
        vendorCount: 245,
        color: 'bg-blue-100 text-blue-600'
    },
    {
        id: 2,
        name: 'Entertainment',
        icon: Music,
        vendorCount: 189,
        color: 'bg-purple-100 text-purple-600'
    },
    {
        id: 3,
        name: 'Catering',
        icon: Utensils,
        vendorCount: 312,
        color: 'bg-amber-100 text-amber-600'
    },
    {
        id: 4,
        name: 'Decor & Flowers',
        icon: Flower2,
        vendorCount: 167,
        color: 'bg-pink-100 text-pink-600'
    },
    {
        id: 5,
        name: 'Transportation',
        icon: Car,
        vendorCount: 98,
        color: 'bg-green-100 text-green-600'
    },
    {
        id: 6,
        name: 'Wedding Planner',
        icon: Heart,
        vendorCount: 76,
        color: 'bg-red-100 text-red-600'
    },
    {
        id: 7,
        name: 'Makeup & Styling',
        icon: Palette,
        vendorCount: 143,
        color: 'bg-indigo-100 text-indigo-600'
    },
    {
        id: 8,
        name: 'Venues',
        icon: Building,
        vendorCount: 89,
        color: 'bg-cyan-100 text-cyan-600'
    }
]

export default function CategoriesSection() {
    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="mb-12 text-center">
                    <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                        Browse by Category
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-gray-600">
                        Find the perfect wedding vendors across all essential categories
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/categories/${category.id}`}
                            className="group rounded-2xl bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                        >
                            <div className="mb-4 flex items-center justify-center">
                                <div className={`rounded-xl p-3 ${category.color}`}>
                                    <category.icon className="h-8 w-8" />
                                </div>
                            </div>
                            <h3 className="mb-2 text-center text-lg font-semibold text-gray-900">
                                {category.name}
                            </h3>
                            <p className="text-center text-sm text-gray-600">
                                {category.vendorCount} vendors
                            </p>
                        </Link>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Link
                        href="/categories"
                        className="inline-flex items-center rounded-lg bg-amber-600 px-6 py-3 font-medium text-white hover:bg-amber-700"
                    >
                        Explore All Categories
                        <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    )
}