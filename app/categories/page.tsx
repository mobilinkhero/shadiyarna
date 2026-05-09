import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Camera, Music, Utensils, Flower2, Car, Heart, Palette, Building2, Tag } from 'lucide-react'

const iconMap: Record<string, React.ElementType> = {
    camera: Camera, music: Music, utensils: Utensils, flower: Flower2,
    car: Car, heart: Heart, palette: Palette, building: Building2,
}

const colorMap = [
    'bg-blue-100 text-blue-600', 'bg-purple-100 text-purple-600',
    'bg-amber-100 text-amber-600', 'bg-pink-100 text-pink-600',
    'bg-green-100 text-green-600', 'bg-red-100 text-red-600',
    'bg-indigo-100 text-indigo-600', 'bg-cyan-100 text-cyan-600',
    'bg-rose-100 text-rose-600', 'bg-teal-100 text-teal-600',
]

export default async function CategoriesPage() {
    const categories = await prisma.category.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        include: { _count: { select: { vendors: true } } },
    })

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-12 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">Browse by Category</h1>
                    <p className="mt-3 text-lg text-gray-600">Find the perfect wedding vendors for every need</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {categories.length === 0 ? (
                    <div className="rounded-2xl bg-white p-16 text-center shadow-sm">
                        <Tag className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                        <h3 className="text-lg font-semibold text-gray-900">No categories yet</h3>
                        <p className="mt-2 text-gray-500">Categories will appear here once added by an admin.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
                        {categories.map((category, i) => {
                            const Icon = (category.icon && iconMap[category.icon.toLowerCase()]) || Tag
                            const color = colorMap[i % colorMap.length]
                            return (
                                <Link
                                    key={category.id}
                                    href={`/vendors?category=${category.slug}`}
                                    className="group rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
                                >
                                    {category.imageUrl ? (
                                        <div className="mb-4 h-24 overflow-hidden rounded-xl">
                                            <img src={category.imageUrl} alt={category.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                                        </div>
                                    ) : (
                                        <div className="mb-4 flex items-center justify-center">
                                            <div className={`rounded-xl p-3 ${color}`}>
                                                <Icon className="h-8 w-8" />
                                            </div>
                                        </div>
                                    )}
                                    <h3 className="text-center text-lg font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                                        {category.name}
                                    </h3>
                                    <p className="mt-1 text-center text-sm text-gray-500">
                                        {category._count.vendors} vendor{category._count.vendors !== 1 ? 's' : ''}
                                    </p>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
