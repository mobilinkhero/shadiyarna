import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Camera, Music, Utensils, Flower2, Car, Heart, Palette, Building2, Tag, ArrowRight } from 'lucide-react'

const iconMap: Record<string, React.ElementType> = {
    camera: Camera, music: Music, utensils: Utensils, flower: Flower2,
    car: Car, heart: Heart, palette: Palette, building: Building2,
}

const gradients = [
    'from-blue-500 to-blue-600',
    'from-purple-500 to-purple-600',
    'from-amber-500 to-orange-500',
    'from-pink-500 to-rose-500',
    'from-green-500 to-emerald-500',
    'from-red-500 to-rose-600',
    'from-indigo-500 to-violet-500',
    'from-cyan-500 to-teal-500',
]

const staticCategories = [
    { id: 'c1', name: 'Venues', slug: 'venues', icon: 'building', vendorCount: 89 },
    { id: 'c2', name: 'Photography', slug: 'photography', icon: 'camera', vendorCount: 245 },
    { id: 'c3', name: 'Catering', slug: 'catering', icon: 'utensils', vendorCount: 312 },
    { id: 'c4', name: 'Makeup & Hair', slug: 'makeup', icon: 'palette', vendorCount: 143 },
    { id: 'c5', name: 'Decor & Flowers', slug: 'decor', icon: 'flower', vendorCount: 167 },
    { id: 'c6', name: 'Entertainment', slug: 'entertainment', icon: 'music', vendorCount: 189 },
    { id: 'c7', name: 'Wedding Planner', slug: 'planner', icon: 'heart', vendorCount: 76 },
    { id: 'c8', name: 'Transportation', slug: 'transport', icon: 'car', vendorCount: 98 },
]

export default async function CategoriesSection() {
    const dbCategories = await prisma.category.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        take: 8,
        include: { _count: { select: { vendors: true } } },
    })

    const categories = dbCategories.length > 0
        ? dbCategories.map(c => ({ id: c.id, name: c.name, slug: c.slug, icon: c.icon ?? '', vendorCount: c._count.vendors }))
        : staticCategories

    return (
        <section className="bg-white py-20">
            <div className="container mx-auto px-4">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Browse by Category</h2>
                    <p className="mt-3 text-gray-500">Everything you need for your perfect wedding, all in one place</p>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
                    {categories.map((cat, i) => {
                        const Icon = iconMap[cat.icon?.toLowerCase()] ?? Tag
                        const gradient = gradients[i % gradients.length]
                        return (
                            <Link
                                key={cat.id}
                                href={`/vendors?category=${cat.slug}`}
                                className="group relative overflow-hidden rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-xl"
                            >
                                {/* Background gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 transition-opacity group-hover:opacity-10`} />
                                <div className="absolute inset-0 rounded-2xl border border-gray-100 group-hover:border-transparent" />

                                <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${gradient} p-3 shadow-lg`}>
                                    <Icon className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="font-semibold text-gray-900 group-hover:text-gray-700">{cat.name}</h3>
                                <p className="mt-1 text-sm text-gray-400">{cat.vendorCount} vendors</p>
                            </Link>
                        )
                    })}
                </div>

                <div className="mt-10 text-center">
                    <Link
                        href="/categories"
                        className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"
                    >
                        Explore all categories <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    )
}
