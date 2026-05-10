'use client'

import { useEffect, useState } from 'react'
import { Edit, Trash2, Eye, FileText } from 'lucide-react'
import PageHeader from '@/components/admin/PageHeader'
import Modal from '@/components/admin/Modal'
import ConfirmDelete from '@/components/admin/ConfirmDelete'
import ImagePicker from '@/components/admin/ImagePicker'

interface BlogPost {
    id: string; title: string; slug: string; excerpt?: string | null
    content: string; coverImage?: string | null; tags: string[]
    isPublished: boolean; publishedAt?: string | null
    authorName?: string | null; createdAt: string
}

function getToken() {
    return typeof document !== 'undefined' ? document.cookie.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1] ?? '' : ''
}

async function apiFetch(url: string, opts: RequestInit = {}) {
    return fetch(url, {
        ...opts,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}`, ...(opts.headers ?? {}) },
    })
}

export default function AdminBlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([])
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState<BlogPost | null>(null)
    const [creating, setCreating] = useState(false)
    const [deleting, setDeleting] = useState<BlogPost | null>(null)

    async function load() {
        setLoading(true)
        try {
            const res = await apiFetch('/api/admin/blog')
            const json = await res.json()
            if (json.success) setPosts(json.data)
        } finally { setLoading(false) }
    }

    useEffect(() => { load() }, [])

    async function handleDelete(post: BlogPost) {
        await apiFetch(`/api/admin/blog/${post.id}`, { method: 'DELETE' })
        load()
    }

    return (
        <div>
            <PageHeader title="Blog" description={`${posts.length} posts`} actionLabel="New Post" onAction={() => setCreating(true)} />

            {loading ? (
                <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">Loading...</div>
            ) : posts.length === 0 ? (
                <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
                    <FileText className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                    <p className="text-sm font-medium text-gray-700">No blog posts yet</p>
                    <p className="mt-1 text-xs text-gray-400">Create your first post to share wedding planning tips</p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {posts.map(p => (
                        <div key={p.id} className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:shadow-md">
                            {p.coverImage ? (
                                <div className="relative h-40 overflow-hidden bg-gray-100">
                                    <img src={p.coverImage} alt={p.title} className="h-full w-full object-cover" />
                                    <span className={`absolute right-2 top-2 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${
                                        p.isPublished ? 'bg-green-50 text-green-700 ring-green-200' : 'bg-amber-50 text-amber-700 ring-amber-200'
                                    }`}>
                                        {p.isPublished ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                            ) : (
                                <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-amber-100 to-rose-100">
                                    <FileText className="h-10 w-10 text-amber-600/50" />
                                </div>
                            )}
                            <div className="p-4">
                                <h3 className="line-clamp-2 font-bold text-gray-900">{p.title}</h3>
                                {p.excerpt && <p className="mt-1 line-clamp-2 text-sm text-gray-500">{p.excerpt}</p>}

                                {p.tags.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-1">
                                        {p.tags.slice(0, 3).map(t => (
                                            <span key={t} className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">#{t}</span>
                                        ))}
                                    </div>
                                )}

                                <div className="mt-4 flex items-center justify-between">
                                    <p className="text-xs text-gray-400">
                                        {p.authorName ?? 'Admin'} · {new Date(p.createdAt).toLocaleDateString()}
                                    </p>
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => setEditing(p)} className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600">
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => setDeleting(p)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {(creating || editing) && (
                <BlogForm post={editing} onClose={() => { setEditing(null); setCreating(false) }} onSaved={() => { setEditing(null); setCreating(false); load() }} />
            )}

            {deleting && (
                <ConfirmDelete open={true} onClose={() => setDeleting(null)}
                    onConfirm={async () => { await handleDelete(deleting) }}
                    title="Delete post"
                    message={`Delete "${deleting.title}"? This cannot be undone.`}
                />
            )}
        </div>
    )
}

function BlogForm({ post, onClose, onSaved }: { post: BlogPost | null; onClose: () => void; onSaved: () => void }) {
    const [form, setForm] = useState({
        title: post?.title ?? '',
        slug: post?.slug ?? '',
        excerpt: post?.excerpt ?? '',
        content: post?.content ?? '',
        coverImage: post?.coverImage ?? '',
        tags: post?.tags ?? [],
        isPublished: post?.isPublished ?? false,
    })
    const [tagInput, setTagInput] = useState('')
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    function autoSlug(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }

    async function save() {
        setSaving(true); setError('')
        try {
            const method = post ? 'PATCH' : 'POST'
            const url = post ? `/api/admin/blog/${post.id}` : '/api/admin/blog'
            const res = await apiFetch(url, { method, body: JSON.stringify(form) })
            const json = await res.json()
            if (!res.ok) throw new Error(json.error || 'Save failed')
            onSaved()
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Save failed')
        } finally { setSaving(false) }
    }

    function addTag() {
        const t = tagInput.trim()
        if (t && !form.tags.includes(t)) setForm({ ...form, tags: [...form.tags, t] })
        setTagInput('')
    }

    return (
        <Modal open={true} onClose={onClose} title={post ? 'Edit Post' : 'New Blog Post'} maxWidth="xl">
            <div className="space-y-4">
                <ImagePicker value={form.coverImage} onChange={v => setForm({ ...form, coverImage: v })} label="Cover Image" aspectRatio="wide" />

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">Title *</label>
                        <input value={form.title}
                            onChange={e => setForm({ ...form, title: e.target.value, slug: form.slug || autoSlug(e.target.value) })}
                            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400" />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">Slug *</label>
                        <input value={form.slug} onChange={e => setForm({ ...form, slug: autoSlug(e.target.value) })}
                            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400" />
                    </div>
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Excerpt</label>
                    <textarea value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} rows={2}
                        className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400" />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Content (Markdown supported) *</label>
                    <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={10}
                        className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2.5 font-mono text-sm outline-none focus:border-gray-400" />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Tags</label>
                    <div className="flex flex-wrap gap-1.5">
                        {form.tags.map(t => (
                            <span key={t} className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                                #{t}
                                <button type="button" onClick={() => setForm({ ...form, tags: form.tags.filter(x => x !== t) })} className="hover:text-red-600">×</button>
                            </span>
                        ))}
                    </div>
                    <div className="mt-2 flex gap-2">
                        <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                            placeholder="Add tag and press Enter"
                            className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400" />
                        <button type="button" onClick={addTag} className="rounded-xl bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200">Add</button>
                    </div>
                </div>

                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={form.isPublished} onChange={e => setForm({ ...form, isPublished: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300" />
                    <span className="text-sm font-medium text-gray-700">Publish immediately</span>
                </label>

                {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
            </div>

            <div className="mt-6 flex justify-end gap-2">
                <button onClick={onClose} disabled={saving} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
                <button onClick={save} disabled={saving || !form.title || !form.content}
                    className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60">
                    {saving ? 'Saving...' : post ? 'Save Changes' : 'Create Post'}
                </button>
            </div>
        </Modal>
    )
}
