import { prisma } from '@/lib/prisma'
import { Tag, CheckCircle, XCircle } from 'lucide-react'

export default async function AdminCategoriesPage() {
    const categories = await prisma.category.findMany({
        orderBy: { sortOrder: 'asc' },
        include: { _count: { select: { vendors: true } } },
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                    <p className="text-gray-600">{categories.length} categories</p>
                </div>
                {/* Add category form would go here — wired to POST /api/categories */}
            </div>

            <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {['Category', 'Slug', 'Vendors', 'Sort Order', 'Status'].map(h => (
                                <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {categories.map((cat) => (
                            <tr key={cat.id} className="hover:bg-gray-50">
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-3">
                                        {cat.imageUrl ? (
                                            <img src={cat.imageUrl} alt={cat.name} className="h-10 w-10 rounded-lg object-cover" />
                                        ) : (
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                                                <Tag className="h-5 w-5 text-amber-600" />
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-medium text-gray-900">{cat.name}</p>
                                            {cat.description && <p className="text-xs text-gray-500 truncate max-w-xs">{cat.description}</p>}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-4 font-mono text-sm text-gray-500">{cat.slug}</td>
                                <td className="px-4 py-4 text-sm text-gray-600">{cat._count.vendors}</td>
                                <td className="px-4 py-4 text-sm text-gray-600">{cat.sortOrder}</td>
                                <td className="px-4 py-4">
                                    {cat.isActive ? (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                            <CheckCircle className="h-3 w-3" /> Active
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                                            <XCircle className="h-3 w-3" /> Inactive
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {categories.length === 0 && (
                    <div className="py-12 text-center text-sm text-gray-500">No categories yet.</div>
                )}
            </div>
        </div>
    )
}
