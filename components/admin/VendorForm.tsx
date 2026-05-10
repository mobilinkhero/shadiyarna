'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Plus, Trash2, Save, CheckCircle, Package, PlusCircle } from 'lucide-react'
import ImagePicker from './ImagePicker'
import GalleryPicker from './GalleryPicker'

interface Category { id: string; name: string; parentId?: string | null }

interface VendorPackage {
    id?: string; name: string; price: string; originalPrice: string
    description: string; features: string[]; isPopular: boolean
}
interface VendorAddon { id?: string; name: string; price: string; description: string }

interface VendorData {
    id?: string
    name: string; slug: string; description: string; about: string
    location: string; address: string; city: string
    phone: string; email: string; website: string
    instagram: string; facebook: string
    priceRange: string
    imageUrl: string; coverImage: string; gallery: string[]
    features: string[]; details: Record<string, string>
    workingHours: Record<string, string>
    isVerified: boolean; isFeatured: boolean; respondsQuickly: boolean
    categoryIds: string[]
    packages: VendorPackage[]
    addons: VendorAddon[]
}

const EMPTY: VendorData = {
    name: '', slug: '', description: '', about: '',
    location: '', address: '', city: 'Karachi',
    phone: '', email: '', website: '', instagram: '', facebook: '',
    priceRange: '',
    imageUrl: '', coverImage: '', gallery: [],
    features: [], details: {}, workingHours: {},
    isVerified: false, isFeatured: false, respondsQuickly: false,
    categoryIds: [],
    packages: [], addons: [],
}

function getToken() {
    if (typeof document === 'undefined') return ''
    return document.cookie.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1] ?? ''
}

function slugify(s: string) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function VendorForm({ vendorId }: { vendorId?: string }) {
    const router = useRouter()
    const [form, setForm] = useState<VendorData>(EMPTY)
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(!!vendorId)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [featureInput, setFeatureInput] = useState('')
    const [detailKey, setDetailKey] = useState('')
    const [detailVal, setDetailVal] = useState('')
    const [hoursDay, setHoursDay] = useState('')
    const [hoursRange, setHoursRange] = useState('')
    const [activeTab, setActiveTab] = useState<'basic' | 'media' | 'details' | 'packages' | 'addons'>('basic')

    // Load data
    useEffect(() => {
        async function load() {
            const headers = { Authorization: `Bearer ${getToken()}` }

            // Load categories
            const catRes = await fetch('/api/admin/categories', { headers })
            const catJson = await catRes.json()
            if (catJson.success) setCategories(catJson.data)

            // Load vendor if editing
            if (vendorId) {
                const vRes = await fetch(`/api/vendors/${vendorId}`, { headers })
                const vJson = await vRes.json()
                if (vJson.data) {
                    const v = vJson.data
                    setForm({
                        id: v.id,
                        name: v.name ?? '', slug: v.slug ?? '',
                        description: v.description ?? '', about: v.about ?? '',
                        location: v.location ?? '', address: v.address ?? '', city: v.city ?? 'Karachi',
                        phone: v.phone ?? '', email: v.email ?? '', website: v.website ?? '',
                        instagram: v.instagram ?? '', facebook: v.facebook ?? '',
                        priceRange: v.priceRange ?? '',
                        imageUrl: v.imageUrl ?? '', coverImage: v.coverImage ?? '',
                        gallery: Array.isArray(v.gallery) ? v.gallery : [],
                        features: Array.isArray(v.features) ? v.features : [],
                        details: v.details ?? {},
                        workingHours: v.workingHours ?? {},
                        isVerified: !!v.isVerified,
                        isFeatured: !!v.isFeatured,
                        respondsQuickly: !!v.respondsQuickly,
                        categoryIds: v.categories?.map((vc: { category: { id: string } }) => vc.category.id) ?? [],
                        packages: v.packages?.map((p: {
                            id: string; name: string; price: string; originalPrice?: string | null
                            description?: string | null; features: string[]; isPopular: boolean
                        }) => ({
                            id: p.id, name: p.name, price: p.price, originalPrice: p.originalPrice ?? '',
                            description: p.description ?? '', features: p.features ?? [], isPopular: p.isPopular,
                        })) ?? [],
                        addons: v.addons?.map((a: { id: string; name: string; price: string; description?: string | null }) => ({
                            id: a.id, name: a.name, price: a.price, description: a.description ?? '',
                        })) ?? [],
                    })
                }
                setLoading(false)
            }
        }
        load()
    }, [vendorId])

    async function save() {
        setSaving(true); setError(''); setSuccess('')
        try {
            if (!form.name || !form.slug || !form.city || !form.phone || !form.imageUrl) {
                throw new Error('Name, slug, city, phone and cover image are required')
            }

            const body = { ...form }
            const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` }

            // Save vendor
            const vRes = vendorId
                ? await fetch(`/api/vendors/${vendorId}`, { method: 'PUT', headers, body: JSON.stringify(body) })
                : await fetch('/api/vendors', { method: 'POST', headers, body: JSON.stringify(body) })

            const vJson = await vRes.json()
            if (!vRes.ok) throw new Error(vJson.error || 'Save failed')

            const saved = vJson.data
            const savedId = saved.id

            // Sync packages
            await syncPackages(savedId, form.packages, saved.packages ?? [])
            // Sync addons
            await syncAddons(savedId, form.addons, saved.addons ?? [])

            setSuccess(vendorId ? 'Vendor updated successfully' : 'Vendor created successfully')

            // Redirect after create
            if (!vendorId) {
                setTimeout(() => router.push(`/admin/vendors/${savedId}`), 800)
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Save failed')
        } finally { setSaving(false) }
    }

    const tabs: { id: typeof activeTab; label: string }[] = [
        { id: 'basic', label: 'Basic Info' },
        { id: 'media', label: 'Images' },
        { id: 'details', label: 'Details' },
        { id: 'packages', label: 'Packages' },
        { id: 'addons', label: 'Add-ons' },
    ]

    if (loading) {
        return <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">Loading vendor...</div>
    }

    return (
        <div className="space-y-6">

            {/* Tabs */}
            <div className="flex overflow-x-auto rounded-xl border border-gray-200 bg-white p-1.5">
                {tabs.map(t => (
                    <button key={t.id} onClick={() => setActiveTab(t.id)}
                        className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                            activeTab === t.id ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
                        }`}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Basic tab */}
            {activeTab === 'basic' && (
                <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Name *"><input value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value, slug: form.slug || slugify(e.target.value) })}
                            className={input} /></Field>
                        <Field label="Slug *"><input value={form.slug}
                            onChange={e => setForm({ ...form, slug: slugify(e.target.value) })}
                            className={input} /></Field>
                    </div>

                    <Field label="Short Description">
                        <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                            placeholder="One-line summary shown in listings" className={input} />
                    </Field>

                    <Field label="About (full description)">
                        <textarea value={form.about} onChange={e => setForm({ ...form, about: e.target.value })} rows={4}
                            className={`${input} resize-none`} />
                    </Field>

                    <div className="grid gap-4 sm:grid-cols-3">
                        <Field label="City *">
                            <select value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className={input}>
                                {['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan'].map(c => <option key={c}>{c}</option>)}
                            </select>
                        </Field>
                        <Field label="Location (area)">
                            <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                                placeholder="DHA Phase 5" className={input} />
                        </Field>
                        <Field label="Price Range">
                            <input value={form.priceRange} onChange={e => setForm({ ...form, priceRange: e.target.value })}
                                placeholder="Rs. 450,000+" className={input} />
                        </Field>
                    </div>

                    <Field label="Address">
                        <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                            placeholder="Full street address" className={input} />
                    </Field>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Phone *">
                            <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                                placeholder="+923001234567" className={input} />
                        </Field>
                        <Field label="Email">
                            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                                placeholder="contact@vendor.com" className={input} />
                        </Field>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        <Field label="Website"><input value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} className={input} /></Field>
                        <Field label="Instagram URL"><input value={form.instagram} onChange={e => setForm({ ...form, instagram: e.target.value })} className={input} /></Field>
                        <Field label="Facebook URL"><input value={form.facebook} onChange={e => setForm({ ...form, facebook: e.target.value })} className={input} /></Field>
                    </div>

                    <Field label="Categories">
                        <div className="flex flex-wrap gap-2">
                            {categories.filter(c => !c.parentId).map(cat => {
                                const isSelected = form.categoryIds.includes(cat.id)
                                return (
                                    <button key={cat.id} type="button"
                                        onClick={() => setForm({
                                            ...form,
                                            categoryIds: isSelected ? form.categoryIds.filter(id => id !== cat.id) : [...form.categoryIds, cat.id],
                                        })}
                                        className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                                            isSelected ? 'bg-gray-900 text-white' : 'border border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                                        }`}>
                                        {isSelected && <CheckCircle className="mr-1 inline h-3.5 w-3.5" />}
                                        {cat.name}
                                    </button>
                                )
                            })}
                        </div>
                    </Field>

                    <div className="flex flex-wrap gap-6 border-t border-gray-100 pt-4">
                        {[
                            { key: 'isVerified', label: 'Verified vendor' },
                            { key: 'isFeatured', label: 'Featured on homepage' },
                            { key: 'respondsQuickly', label: 'Quick reply (< 1 hr)' },
                        ].map(toggle => (
                            <label key={toggle.key} className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={form[toggle.key as keyof VendorData] as boolean}
                                    onChange={e => setForm({ ...form, [toggle.key]: e.target.checked })}
                                    className="h-4 w-4 rounded border-gray-300" />
                                <span className="text-sm font-medium text-gray-700">{toggle.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Media tab */}
            {activeTab === 'media' && (
                <div className="space-y-6 rounded-xl border border-gray-200 bg-white p-6">
                    <ImagePicker value={form.imageUrl} onChange={v => setForm({ ...form, imageUrl: v })}
                        label="Main Image *" aspectRatio="wide" />
                    <ImagePicker value={form.coverImage} onChange={v => setForm({ ...form, coverImage: v })}
                        label="Cover Image (optional banner)" aspectRatio="wide" />
                    <GalleryPicker value={form.gallery} onChange={v => setForm({ ...form, gallery: v })} label="Gallery" />
                </div>
            )}

            {/* Details tab */}
            {activeTab === 'details' && (
                <div className="space-y-6 rounded-xl border border-gray-200 bg-white p-6">
                    {/* Features */}
                    <div>
                        <h3 className="mb-2 text-sm font-semibold text-gray-700">Features / Amenities</h3>
                        <div className="mb-2 flex flex-wrap gap-1.5">
                            {form.features.map(f => (
                                <span key={f} className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                                    {f}
                                    <button type="button" onClick={() => setForm({ ...form, features: form.features.filter(x => x !== f) })} className="hover:text-red-600">×</button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input value={featureInput} onChange={e => setFeatureInput(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault()
                                        if (featureInput.trim() && !form.features.includes(featureInput.trim())) {
                                            setForm({ ...form, features: [...form.features, featureInput.trim()] })
                                            setFeatureInput('')
                                        }
                                    }
                                }}
                                placeholder="e.g. Air Conditioned, Parking for 300 cars" className={input} />
                            <button type="button" onClick={() => {
                                if (featureInput.trim() && !form.features.includes(featureInput.trim())) {
                                    setForm({ ...form, features: [...form.features, featureInput.trim()] })
                                    setFeatureInput('')
                                }
                            }} className="shrink-0 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200">Add</button>
                        </div>
                    </div>

                    {/* Details key-value */}
                    <div>
                        <h3 className="mb-2 text-sm font-semibold text-gray-700">Details (Key: Value)</h3>
                        <div className="mb-2 space-y-1.5">
                            {Object.entries(form.details).map(([k, v]) => (
                                <div key={k} className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-2">
                                    <span className="flex-1 text-xs text-gray-400">{k}</span>
                                    <span className="flex-1 text-sm text-gray-800">{v}</span>
                                    <button type="button" onClick={() => {
                                        const d = { ...form.details }; delete d[k]
                                        setForm({ ...form, details: d })
                                    }} className="rounded p-1 text-gray-400 hover:text-red-600">
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                            <input value={detailKey} onChange={e => setDetailKey(e.target.value)} placeholder="Key (e.g. Capacity)" className={input} />
                            <input value={detailVal} onChange={e => setDetailVal(e.target.value)} placeholder="Value (e.g. 500-1000 guests)" className={input} />
                            <button type="button" onClick={() => {
                                if (detailKey.trim() && detailVal.trim()) {
                                    setForm({ ...form, details: { ...form.details, [detailKey.trim()]: detailVal.trim() } })
                                    setDetailKey(''); setDetailVal('')
                                }
                            }} className="rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200">Add</button>
                        </div>
                    </div>

                    {/* Working hours */}
                    <div>
                        <h3 className="mb-2 text-sm font-semibold text-gray-700">Working Hours</h3>
                        <div className="mb-2 space-y-1.5">
                            {Object.entries(form.workingHours).map(([day, hours]) => (
                                <div key={day} className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-2">
                                    <span className="flex-1 text-sm font-medium text-gray-700">{day}</span>
                                    <span className="flex-1 text-sm text-gray-600">{hours}</span>
                                    <button type="button" onClick={() => {
                                        const wh = { ...form.workingHours }; delete wh[day]
                                        setForm({ ...form, workingHours: wh })
                                    }} className="rounded p-1 text-gray-400 hover:text-red-600">
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                            <input value={hoursDay} onChange={e => setHoursDay(e.target.value)} placeholder="Day (e.g. Monday - Friday)" className={input} />
                            <input value={hoursRange} onChange={e => setHoursRange(e.target.value)} placeholder="Hours (e.g. 10:00 AM - 8:00 PM)" className={input} />
                            <button type="button" onClick={() => {
                                if (hoursDay.trim() && hoursRange.trim()) {
                                    setForm({ ...form, workingHours: { ...form.workingHours, [hoursDay.trim()]: hoursRange.trim() } })
                                    setHoursDay(''); setHoursRange('')
                                }
                            }} className="rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200">Add</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Packages tab */}
            {activeTab === 'packages' && (
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900">
                            <Package className="h-4 w-4 text-[#B8860B]" /> Packages
                        </h3>
                        <button type="button" onClick={() => setForm({
                            ...form, packages: [...form.packages, { name: '', price: '', originalPrice: '', description: '', features: [], isPopular: false }],
                        })} className="inline-flex items-center gap-1 rounded-lg bg-gray-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-gray-800">
                            <Plus className="h-3.5 w-3.5" /> Add Package
                        </button>
                    </div>

                    {form.packages.length === 0 ? (
                        <p className="py-8 text-center text-sm text-gray-400">No packages yet. Click &ldquo;Add Package&rdquo; to create one.</p>
                    ) : (
                        <div className="space-y-4">
                            {form.packages.map((pkg, i) => (
                                <PackageEditor key={i} pkg={pkg}
                                    onChange={p => {
                                        const pkgs = [...form.packages]; pkgs[i] = p
                                        setForm({ ...form, packages: pkgs })
                                    }}
                                    onRemove={() => setForm({ ...form, packages: form.packages.filter((_, idx) => idx !== i) })}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Addons tab */}
            {activeTab === 'addons' && (
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900">
                            <PlusCircle className="h-4 w-4 text-[#B8860B]" /> Add-ons
                        </h3>
                        <button type="button" onClick={() => setForm({
                            ...form, addons: [...form.addons, { name: '', price: '', description: '' }],
                        })} className="inline-flex items-center gap-1 rounded-lg bg-gray-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-gray-800">
                            <Plus className="h-3.5 w-3.5" /> Add Add-on
                        </button>
                    </div>

                    {form.addons.length === 0 ? (
                        <p className="py-8 text-center text-sm text-gray-400">No add-ons yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {form.addons.map((addon, i) => (
                                <div key={i} className="grid gap-2 rounded-xl border border-gray-200 p-4 sm:grid-cols-[1fr_1fr_auto_auto]">
                                    <input value={addon.name} onChange={e => {
                                        const as = [...form.addons]; as[i] = { ...addon, name: e.target.value }
                                        setForm({ ...form, addons: as })
                                    }} placeholder="Add-on name" className={input} />
                                    <input value={addon.price} onChange={e => {
                                        const as = [...form.addons]; as[i] = { ...addon, price: e.target.value }
                                        setForm({ ...form, addons: as })
                                    }} placeholder="Price (e.g. Rs. 15,000)" className={input} />
                                    <input value={addon.description} onChange={e => {
                                        const as = [...form.addons]; as[i] = { ...addon, description: e.target.value }
                                        setForm({ ...form, addons: as })
                                    }} placeholder="Description (optional)" className={input} />
                                    <button type="button" onClick={() => setForm({ ...form, addons: form.addons.filter((_, idx) => idx !== i) })}
                                        className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Save bar */}
            <div className="sticky bottom-0 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
                <div className="min-w-0 flex-1">
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    {success && <p className="flex items-center gap-1.5 text-sm text-green-600"><CheckCircle className="h-4 w-4" /> {success}</p>}
                    {!error && !success && <p className="text-xs text-gray-400">All changes are saved when you click Save.</p>}
                </div>
                <div className="flex gap-2">
                    <button onClick={() => router.push('/admin/vendors')} disabled={saving}
                        className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                        Cancel
                    </button>
                    <button onClick={save} disabled={saving}
                        className="flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60">
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {vendorId ? 'Save Changes' : 'Create Vendor'}
                    </button>
                </div>
            </div>
        </div>
    )
}

const input = 'w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
            {children}
        </div>
    )
}

function PackageEditor({ pkg, onChange, onRemove }: { pkg: VendorPackage; onChange: (p: VendorPackage) => void; onRemove: () => void }) {
    const [featureInput, setFeatureInput] = useState('')

    return (
        <div className="space-y-3 rounded-xl border border-gray-200 p-4">
            <div className="grid gap-3 sm:grid-cols-2">
                <input value={pkg.name} onChange={e => onChange({ ...pkg, name: e.target.value })}
                    placeholder="Package name" className={input} />
                <input value={pkg.price} onChange={e => onChange({ ...pkg, price: e.target.value })}
                    placeholder="Price (e.g. Rs. 450,000)" className={input} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
                <input value={pkg.originalPrice} onChange={e => onChange({ ...pkg, originalPrice: e.target.value })}
                    placeholder="Original price (optional, shown struck-through)" className={input} />
                <label className="flex items-center gap-2 self-center">
                    <input type="checkbox" checked={pkg.isPopular}
                        onChange={e => onChange({ ...pkg, isPopular: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300" />
                    <span className="text-sm text-gray-700">Mark as &ldquo;Most Popular&rdquo;</span>
                </label>
            </div>
            <textarea value={pkg.description} onChange={e => onChange({ ...pkg, description: e.target.value })}
                placeholder="Description" rows={2} className={`${input} resize-none`} />

            <div>
                <p className="mb-1.5 text-xs font-semibold text-gray-500">Features / Includes</p>
                <div className="mb-2 flex flex-wrap gap-1.5">
                    {pkg.features.map(f => (
                        <span key={f} className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 ring-1 ring-green-100">
                            {f}
                            <button type="button" onClick={() => onChange({ ...pkg, features: pkg.features.filter(x => x !== f) })} className="hover:text-red-600">×</button>
                        </span>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input value={featureInput} onChange={e => setFeatureInput(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                e.preventDefault()
                                if (featureInput.trim()) {
                                    onChange({ ...pkg, features: [...pkg.features, featureInput.trim()] })
                                    setFeatureInput('')
                                }
                            }
                        }}
                        placeholder="Feature (press Enter to add)" className={input} />
                    <button type="button" onClick={onRemove} className="shrink-0 rounded-xl bg-red-50 px-3 py-2.5 text-red-600 hover:bg-red-100">
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}

// ── Sync helpers ───────────────────────────────────────────────────────────
async function syncPackages(vendorId: string, desired: VendorPackage[], current: { id: string }[]) {
    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` }
    const currentIds = new Set(current.map(p => p.id))
    const desiredIds = new Set(desired.filter(p => p.id).map(p => p.id!))

    // Delete removed
    for (const old of current) {
        if (!desiredIds.has(old.id)) {
            await fetch(`/api/admin/packages/${old.id}`, { method: 'DELETE', headers }).catch(() => {})
        }
    }

    // Create/update
    for (const p of desired) {
        const body = JSON.stringify({
            name: p.name, price: p.price,
            originalPrice: p.originalPrice || null,
            description: p.description || null,
            features: p.features, isPopular: p.isPopular,
            vendorId,
        })
        if (p.id && currentIds.has(p.id)) {
            await fetch(`/api/admin/packages/${p.id}`, { method: 'PATCH', headers, body }).catch(() => {})
        } else {
            await fetch('/api/admin/packages', { method: 'POST', headers, body }).catch(() => {})
        }
    }
}

async function syncAddons(vendorId: string, desired: VendorAddon[], current: { id: string }[]) {
    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` }
    const currentIds = new Set(current.map(a => a.id))
    const desiredIds = new Set(desired.filter(a => a.id).map(a => a.id!))

    for (const old of current) {
        if (!desiredIds.has(old.id)) {
            await fetch(`/api/admin/addons/${old.id}`, { method: 'DELETE', headers }).catch(() => {})
        }
    }

    for (const a of desired) {
        const body = JSON.stringify({
            name: a.name, price: a.price,
            description: a.description || null,
            vendorId,
        })
        if (a.id && currentIds.has(a.id)) {
            await fetch(`/api/admin/addons/${a.id}`, { method: 'PATCH', headers, body }).catch(() => {})
        } else {
            await fetch('/api/admin/addons', { method: 'POST', headers, body }).catch(() => {})
        }
    }
}
