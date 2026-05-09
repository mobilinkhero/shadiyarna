import { prisma } from '@/lib/prisma'
import { User, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'

interface SearchParams { page?: string; search?: string; role?: string }

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const sp = await searchParams
    const page = Math.max(1, parseInt(sp.page || '1'))
    const limit = 20
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (sp.search) where.OR = [{ name: { contains: sp.search } }, { phone: { contains: sp.search } }, { email: { contains: sp.search } }]
    if (sp.role) where.role = sp.role

    const [total, users] = await Promise.all([
        prisma.user.count({ where }),
        prisma.user.findMany({
            where, skip, take: limit,
            select: {
                id: true, name: true, phone: true, email: true,
                role: true, isActive: true, createdAt: true, lastLogin: true,
                _count: { select: { bookings: true, reviews: true } },
            },
            orderBy: { createdAt: 'desc' },
        }),
    ])

    const totalPages = Math.ceil(total / limit)
    const roleColors: Record<string, string> = {
        USER: 'bg-gray-100 text-gray-700',
        VENDOR: 'bg-blue-100 text-blue-700',
        ADMIN: 'bg-purple-100 text-purple-700',
        SUPER_ADMIN: 'bg-red-100 text-red-700',
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Users</h1>
                    <p className="text-gray-600">{total} total users</p>
                </div>
            </div>

            <div className="flex flex-wrap gap-3 rounded-xl border bg-white p-4 shadow-sm">
                <form className="flex gap-2">
                    <input name="search" defaultValue={sp.search} placeholder="Search by name, phone, email…" className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
                    <select name="role" defaultValue={sp.role || ''} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none">
                        <option value="">All Roles</option>
                        <option value="USER">User</option>
                        <option value="VENDOR">Vendor</option>
                        <option value="ADMIN">Admin</option>
                        <option value="SUPER_ADMIN">Super Admin</option>
                    </select>
                    <button type="submit" className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">Filter</button>
                </form>
            </div>

            <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {['User', 'Phone', 'Role', 'Bookings', 'Status', 'Joined'].map(h => (
                                <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map((u) => (
                            <tr key={u.id} className="hover:bg-gray-50">
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                                            {(u.name ?? u.phone)[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{u.name ?? '—'}</p>
                                            <p className="text-xs text-gray-500">{u.email ?? ''}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-600">{u.phone}</td>
                                <td className="px-4 py-4">
                                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${roleColors[u.role] ?? 'bg-gray-100 text-gray-700'}`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-600">{u._count.bookings}</td>
                                <td className="px-4 py-4">
                                    {u.isActive ? (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                            <CheckCircle className="h-3 w-3" /> Active
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                                            <XCircle className="h-3 w-3" /> Inactive
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-500">
                                    {new Date(u.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && <div className="py-12 text-center text-sm text-gray-500">No users found.</div>}
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    {page > 1 && <Link href={`?page=${page - 1}`} className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">Previous</Link>}
                    <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
                    {page < totalPages && <Link href={`?page=${page + 1}`} className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">Next</Link>}
                </div>
            )}
        </div>
    )
}
