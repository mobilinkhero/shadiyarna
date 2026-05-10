'use client'

import { useEffect, useState } from 'react'
import { Edit, Trash2, Search, Filter } from 'lucide-react'
import PageHeader from '@/components/admin/PageHeader'
import Modal from '@/components/admin/Modal'
import ConfirmDelete from '@/components/admin/ConfirmDelete'

interface User {
    id: string; name?: string | null; email?: string | null; phone: string
    avatar?: string | null; role: string; isActive: boolean
    createdAt: string; lastLogin?: string | null
    _count: { bookings: number; reviews: number }
}

function getToken() {
    if (typeof document === 'undefined') return ''
    return document.cookie.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1] ?? ''
}

async function apiFetch(url: string, opts: RequestInit = {}) {
    const token = getToken()
    return fetch(url, {
        ...opts,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(opts.headers ?? {}),
        },
    })
}

const roleColors: Record<string, string> = {
    USER: 'bg-gray-50 text-gray-700 ring-gray-200',
    VENDOR: 'bg-blue-50 text-blue-700 ring-blue-200',
    ADMIN: 'bg-purple-50 text-purple-700 ring-purple-200',
    SUPER_ADMIN: 'bg-red-50 text-red-700 ring-red-200',
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [role, setRole] = useState('')
    const [editing, setEditing] = useState<User | null>(null)
    const [deleting, setDeleting] = useState<User | null>(null)

    async function load() {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (search) params.set('search', search)
            if (role) params.set('role', role)
            params.set('limit', '100')
            // use the public API that lists users (since we have admin guard via proxy)
            const res = await fetch(`/api/admin/users?${params}`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            })
            if (res.ok) {
                const json = await res.json()
                setUsers(json.data ?? [])
            }
        } finally { setLoading(false) }
    }

    useEffect(() => { load() }, [role])

    async function handleDelete(user: User) {
        await apiFetch(`/api/admin/users/${user.id}`, { method: 'DELETE' })
        load()
    }

    const filtered = users.filter(u => {
        if (!search) return true
        const s = search.toLowerCase()
        return (u.name?.toLowerCase().includes(s) || u.email?.toLowerCase().includes(s) || u.phone.includes(s))
    })

    return (
        <div>
            <PageHeader title="Users" description={`${users.length} registered users`} />

            {/* Filters */}
            <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-3">
                <div className="flex flex-1 items-center gap-2 min-w-[200px]">
                    <Search className="h-4 w-4 text-gray-400" />
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, phone, email..."
                        className="flex-1 bg-transparent text-sm outline-none" />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <select value={role} onChange={e => setRole(e.target.value)}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm outline-none">
                        <option value="">All roles</option>
                        <option value="USER">User</option>
                        <option value="VENDOR">Vendor</option>
                        <option value="ADMIN">Admin</option>
                        <option value="SUPER_ADMIN">Super Admin</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            {['User', 'Phone', 'Role', 'Activity', 'Joined', 'Status', ''].map(h => (
                                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-gray-400">Loading...</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-gray-400">No users found</td></tr>
                        ) : filtered.map(u => (
                            <tr key={u.id} className="hover:bg-gray-50">
                                <td className="whitespace-nowrap px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-rose-400 text-sm font-bold text-white">
                                            {(u.name ?? u.phone)[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{u.name ?? '—'}</p>
                                            <p className="text-xs text-gray-500">{u.email ?? ''}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{u.phone}</td>
                                <td className="whitespace-nowrap px-4 py-3">
                                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${roleColors[u.role] ?? roleColors.USER}`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-500">
                                    {u._count.bookings} bookings · {u._count.reviews} reviews
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                    {new Date(u.createdAt).toLocaleDateString()}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3">
                                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${
                                        u.isActive ? 'bg-green-50 text-green-700 ring-green-200' : 'bg-gray-100 text-gray-600 ring-gray-200'
                                    }`}>
                                        {u.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-right">
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => setEditing(u)} className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600" title="Edit">
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => setDeleting(u)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600" title="Delete">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editing && (
                <UserForm user={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load() }} />
            )}

            {deleting && (
                <ConfirmDelete open={true} onClose={() => setDeleting(null)}
                    onConfirm={async () => { await handleDelete(deleting) }}
                    title="Delete user"
                    message={`Delete "${deleting.name ?? deleting.phone}"? All their bookings, reviews and wishlists will be removed.`}
                />
            )}
        </div>
    )
}

function UserForm({ user, onClose, onSaved }: { user: User; onClose: () => void; onSaved: () => void }) {
    const [form, setForm] = useState({
        name: user.name ?? '',
        email: user.email ?? '',
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        password: '',
    })
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    async function save() {
        setSaving(true); setError('')
        try {
            const body: Record<string, unknown> = {
                name: form.name, email: form.email || null,
                phone: form.phone, role: form.role, isActive: form.isActive,
            }
            if (form.password) body.password = form.password
            const res = await apiFetch(`/api/admin/users/${user.id}`, { method: 'PATCH', body: JSON.stringify(body) })
            const json = await res.json()
            if (!res.ok) throw new Error(json.error || 'Save failed')
            onSaved()
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Save failed')
        } finally { setSaving(false) }
    }

    return (
        <Modal open={true} onClose={onClose} title="Edit User" maxWidth="md">
            <div className="space-y-4">
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Name</label>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400" />
                </div>
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400" />
                </div>
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Phone</label>
                    <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">Role</label>
                        <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400">
                            <option value="USER">User</option>
                            <option value="VENDOR">Vendor</option>
                            <option value="ADMIN">Admin</option>
                            <option value="SUPER_ADMIN">Super Admin</option>
                        </select>
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">Status</label>
                        <select value={form.isActive ? 'active' : 'inactive'} onChange={e => setForm({ ...form, isActive: e.target.value === 'active' })}
                            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400">
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">New Password (optional)</label>
                    <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                        placeholder="Leave empty to keep current"
                        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400" />
                </div>
                {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
            </div>
            <div className="mt-6 flex justify-end gap-2">
                <button onClick={onClose} disabled={saving} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
                <button onClick={save} disabled={saving}
                    className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60">
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </Modal>
    )
}
