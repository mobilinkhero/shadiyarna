'use client'

import { useEffect, useState } from 'react'
import { ChevronRight, ChevronDown, Edit, Trash2, Plus, Tag } from 'lucide-react'
import PageHeader from '@/components/admin/PageHeader'
import Modal from '@/components/admin/Modal'
import ConfirmDelete from '@/components/admin/ConfirmDelete'
import ImagePicker from '@/components/admin/ImagePicker'

interface Category {
    id: string
    name: string
    slug: string
    description?: string | null
    imageUrl?: string | null
    icon?: string | null
    sortOrder: number
    isActive: boolean
    parentId?: string | null
    parent?: { id: string; name: string } | null
    _count: { vendors: number; children: number }
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

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [expanded, setExpanded] = useState<Set<string>>(new Set())
    const [formOpen, setFormOpen] = useState(false)
    const [editing, setEditing] = useState<Category | null>(null)
    const [parentFor, setParentFor] = useState<string | null>(null)
    const [deleting, setDeleting] = useState<Category | null>(null)

    async function load() {
        setLoading(true)
        try {
            const res = await apiFetch('/api/admin/categories')
            const json = await res.json()
            if (json.success) setCategories(json.data)
        } finally { setLoading(false) }
    }

    useEffect(() => { load() }, [])

    const roots = categories.filter(c => !c.parentId)
    const childrenOf = (id: string) => categories.filter(c => c.parentId === id)

    function toggleExpand(id: string) {
        setExpanded(prev => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id); else next.add(id)
            return next
        })
    }

    async function handleDelete(cat: Category) {
        await apiFetch(`/api/admin/categories/${cat.id}`, { method: 'DELETE' })
        load()
    }

    function openCreate(parent?: string) {
        setEditing(null)
        setParentFor(parent ?? null)
        setFormOpen(true)
    }

    function openEdit(cat: Category) {
        setEditing(cat)
        setParentFor(null)
        setFormOpen(true)
    }

    return (
        <div>
            <PageHeader
                title="Categories"
                description="Organise vendors into categories and subcategories"
                actionLabel="Add Category"
                onAction={() => openCreate()}
            />

            {loading ? (
                <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">Loading...</div>
            ) : roots.length === 0 ? (
                <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
                    <Tag className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                    <p className="text-sm font-medium text-gray-700">No categories yet</p>
                    <p className="mt-1 text-xs text-gray-400">Create your first category to organise vendors</p>
                </div>
            ) : (
                <div className="rounded-xl border border-gray-200 bg-white">
                    {roots.map(cat => (
                        <CategoryRow key={cat.id} cat={cat} level={0}
                            children={childrenOf(cat.id)}
                            childrenOf={childrenOf}
                            expanded={expanded}
                            toggleExpand={toggleExpand}
                            onEdit={openEdit}
                            onAddChild={openCreate}
                            onDelete={(c) => setDeleting(c)}
                        />
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
            {formOpen && (
                <CategoryForm
                    category={editing}
                    parentId={parentFor}
                    allCategories={categories}
                    onClose={() => setFormOpen(false)}
                    onSaved={() => { setFormOpen(false); load() }}
                />
            )}

            {/* Delete confirmation */}
            {deleting && (
                <ConfirmDelete
                    open={true}
                    onClose={() => setDeleting(null)}
                    onConfirm={async () => { await handleDelete(deleting) }}
                    title="Delete category"
                    message={`Are you sure you want to delete "${deleting.name}"? This action cannot be undone.`}
                />
            )}
        </div>
    )
}

function CategoryRow({
    cat, level, children, childrenOf, expanded, toggleExpand, onEdit, onAddChild, onDelete,
}: {
    cat: Category; level: number; children: Category[]; childrenOf: (id: string) => Category[]
    expanded: Set<string>; toggleExpand: (id: string) => void
    onEdit: (c: Category) => void; onAddChild: (parentId: string) => void; onDelete: (c: Category) => void
}) {
    const isExpanded = expanded.has(cat.id)
    return (
        <>
            <div className={`flex items-center gap-3 border-b border-gray-100 px-4 py-3 last:border-b-0 hover:bg-gray-50 ${level > 0 ? 'bg-gray-50/50' : ''}`}
                style={{ paddingLeft: `${16 + level * 24}px` }}>
                {children.length > 0 ? (
                    <button onClick={() => toggleExpand(cat.id)} className="rounded p-0.5 hover:bg-gray-200">
                        {isExpanded ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                    </button>
                ) : (
                    <span className="w-5" />
                )}

                {cat.imageUrl ? (
                    <img src={cat.imageUrl} alt={cat.name} className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-100 to-rose-100">
                        <Tag className="h-4 w-4 text-amber-600" />
                    </div>
                )}

                <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900">{cat.name}</p>
                    <p className="truncate text-xs text-gray-500">{cat.slug} · {cat._count.vendors} vendors · {cat._count.children} subcategories</p>
                </div>

                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${
                    cat.isActive ? 'bg-green-50 text-green-700 ring-green-100' : 'bg-gray-100 text-gray-600 ring-gray-200'
                }`}>
                    {cat.isActive ? 'Active' : 'Inactive'}
                </span>

                <div className="flex items-center gap-1">
                    {level === 0 && (
                        <button onClick={() => onAddChild(cat.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700" title="Add subcategory">
                            <Plus className="h-4 w-4" />
                        </button>
                    )}
                    <button onClick={() => onEdit(cat)} className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600" title="Edit">
                        <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => onDelete(cat)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600" title="Delete">
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {isExpanded && children.map(child => (
                <CategoryRow key={child.id} cat={child} level={level + 1}
                    children={childrenOf(child.id)}
                    childrenOf={childrenOf}
                    expanded={expanded}
                    toggleExpand={toggleExpand}
                    onEdit={onEdit}
                    onAddChild={onAddChild}
                    onDelete={onDelete}
                />
            ))}
        </>
    )
}

function CategoryForm({ category, parentId, allCategories, onClose, onSaved }: {
    category: Category | null; parentId: string | null; allCategories: Category[]
    onClose: () => void; onSaved: () => void
}) {
    const [form, setForm] = useState({
        name: category?.name ?? '',
        slug: category?.slug ?? '',
        description: category?.description ?? '',
        imageUrl: category?.imageUrl ?? '',
        icon: category?.icon ?? '',
        sortOrder: category?.sortOrder ?? 0,
        isActive: category?.isActive ?? true,
        parentId: category?.parentId ?? parentId ?? '',
    })
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    async function save() {
        setSaving(true); setError('')
        try {
            const method = category ? 'PATCH' : 'POST'
            const url = category ? `/api/admin/categories/${category.id}` : '/api/admin/categories'
            const res = await apiFetch(url, { method, body: JSON.stringify(form) })
            const json = await res.json()
            if (!res.ok) throw new Error(json.error || 'Save failed')
            onSaved()
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Save failed')
        } finally { setSaving(false) }
    }

    function autoSlug(name: string) {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    }

    // Possible parents — only root categories (exclude self)
    const parentOptions = allCategories.filter(c => !c.parentId && c.id !== category?.id)

    return (
        <Modal open={true} onClose={onClose}
            title={category ? 'Edit Category' : 'New Category'}
            description={parentId ? 'Creating as subcategory' : undefined}
            maxWidth="lg">
            <div className="space-y-4">
                <ImagePicker value={form.imageUrl} onChange={url => setForm({ ...form, imageUrl: url })} label="Cover Image" />

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">Name *</label>
                        <input type="text" value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value, slug: form.slug || autoSlug(e.target.value) })}
                            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400" />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">Slug *</label>
                        <input type="text" value={form.slug}
                            onChange={e => setForm({ ...form, slug: autoSlug(e.target.value) })}
                            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400" />
                    </div>
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Description</label>
                    <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3}
                        className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400" />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">Parent Category</label>
                        <select value={form.parentId} onChange={e => setForm({ ...form, parentId: e.target.value })}
                            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400">
                            <option value="">None (top-level)</option>
                            {parentOptions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">Sort Order</label>
                        <input type="number" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
                            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400" />
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

                {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
            </div>

            <div className="mt-6 flex justify-end gap-2">
                <button onClick={onClose} disabled={saving} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
                <button onClick={save} disabled={saving || !form.name || !form.slug}
                    className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60">
                    {saving ? 'Saving...' : category ? 'Save Changes' : 'Create Category'}
                </button>
            </div>
        </Modal>
    )
}
