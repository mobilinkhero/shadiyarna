import { prisma } from '@/lib/prisma'
import Link from 'next/link'

const categoryImages: Record<string, string> = {
    venues: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=200&q=80',
    photography: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=200&q=80',
    makeup: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=200&q=80',
    catering: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=200&q=80',
    decor: 'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=200&q=80',
    entertainment: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=200&q=80',
    planner: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=200&q=80',
    transport: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=200&q=80',
}

const staticCategories = [
    { id: 'c1', name: 'Venues', slug: 'venues' },
    { id: 'c2', name: 'Photographers', slug: 'photography' },
    { id: 'c3', name: 'Makeup Artists', slug: 'makeup' },
    { id: 'c4', name: 'Caterers', slug: 'catering' },
]

export default async function CategoriesSection() {
    const dbCategories = await prisma.category.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        take: 4,
    })

    const categories = dbCategories.length > 0
        ? dbCategories.map(c => ({ id: c.id, name: c.name, slug: c.slug }))
        : staticCategories

    return (
        <section className="bg-white px-4 py-6">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Categories</h2>
                <Link href="/categories" className="rounded-lg bg-[#FFF8EE] px-3 py-1.5 text-xs font-semibold text-[#B8860B]">
                    See all
                </Link>
            </div>
            <div className="grid grid-cols-4 gap-3">
                {categories.map((cat) => {
                    const img = categoryImages[cat.slug] ?? categoryImages['venues']
                    return (
                        <Link key={cat.id} href={`/vendors?category=${cat.slug}`} className="group flex flex-col items-center gap-2">
                            <div className="h-14 w-14 overflow-hidden rounded-2xl border border-gray-100 shadow-sm transition-transform group-hover:scale-105">
                                <img src={img} alt={cat.name} className="h-full w-full object-cover" />
                            </div>
                            <span className="text-center text-xs font-medium text-gray-600 leading-tight">{cat.name}</span>
                        </Link>
                    )
                })}
            </div>
        </section>
    )
}
