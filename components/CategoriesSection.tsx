import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const categoryImages: Record<string, string> = {
    venues: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&q=80',
    photography: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400&q=80',
    makeup: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&q=80',
    catering: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=400&q=80',
    decor: 'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=400&q=80',
    entertainment: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&q=80',
    planner: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&q=80',
    transport: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=80',
}

const staticCategories = [
    { id: 'c1', name: 'Venues', slug: 'venues', vendorCount: 120 },
    { id: 'c2', name: 'Photographers', slug: 'photography', vendorCount: 180 },
    { id: 'c3', name: 'Makeup Artists', slug: 'makeup', vendorCount: 150 },
    { id: 'c4', name: 'Caterers', slug: 'catering', vendorCount: 100 },
    { id: 'c5', name: 'Decorators', slug: 'decor', vendorCount: 200 },
    { id: 'c6', name: 'Entertainment', slug: 'entertainment', vendorCount: 80 },
]

export default async function CategoriesSection() {
    const dbCategories = await prisma.category.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        take: 6,
        include: { _count: { select: { vendors: true } } },
    })

    const categories = dbCategories.length > 0
        ? dbCategories.map(c => ({ id: c.id, name: c.name, slug: c.slug, vendorCount: c._count.vendors }))
        : staticCategories

    return (
        <section className="bg-white py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="mb-10 flex items-end justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Browse by Category</h2>
                        <p className="mt-2 text-gray-500">Find the perfect vendors for every wedding need</p>
                    </div>
                    <Link href="/categories" className="hidden items-center gap-1 text-sm font-semibold text-[#B8860B] hover:text-[#D4A017] sm:flex">
                        View all <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                    {categories.map((cat) => {
                        const img = categoryImages[cat.slug] ?? categoryImages['venues']
                        return (
                            <Link key={cat.id} href={`/vendors?category=${cat.slug}`}
                                className="group overflow-hidden rounded-2xl shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                                <div className="relative h-32 overflow-hidden sm:h-36">
                                    <img src={img} alt={cat.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-3">
                                        <p className="font-bold text-white text-sm leading-tight">{cat.name}</p>
                                        <p className="text-xs text-white/70">{cat.vendorCount}+ vendors</p>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
