'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Phone, Loader2, ShieldCheck } from 'lucide-react'

export default function AdminLoginPage() {
    const router = useRouter()
    const [form, setForm] = useState({ phone: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(''); setLoading(true)
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })
            const json = await res.json()
            if (!res.ok || !json.success) {
                setError(json.error || 'Login failed'); return
            }
            const { token, user } = json.data
            if (!['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
                setError('You do not have admin access'); return
            }
            document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`
            router.push('/admin')
        } catch {
            setError('Network error. Please try again.')
        } finally { setLoading(false) }
    }

    return (
        <div className="flex min-h-screen bg-[#0F172A]">

            {/* Left branding */}
            <div className="hidden flex-1 flex-col justify-between p-10 lg:flex">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600">
                        <span className="text-sm font-bold italic text-white">S</span>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">Shadiyarana</p>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Admin Panel</p>
                    </div>
                </div>

                <div className="max-w-md">
                    <ShieldCheck className="mb-6 h-10 w-10 text-amber-400" />
                    <h2 className="text-3xl font-bold text-white leading-tight">
                        Manage your entire wedding platform from one place.
                    </h2>
                    <p className="mt-4 text-slate-400 leading-relaxed">
                        Monitor vendors, review bookings, track analytics, and keep your platform running smoothly.
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
                    {[['10K+', 'Couples'], ['2.5K+', 'Vendors'], ['4.8/5', 'Rating']].map(([v, l]) => (
                        <div key={l}>
                            <p className="text-xl font-bold text-white">{v}</p>
                            <p className="text-xs text-slate-500">{l}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right form */}
            <div className="flex flex-1 items-center justify-center bg-white p-6 lg:max-w-lg lg:rounded-l-3xl">
                <div className="w-full max-w-sm">

                    {/* Mobile logo */}
                    <div className="mb-8 flex items-center gap-2.5 lg:hidden">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600">
                            <span className="text-sm font-bold italic text-white">S</span>
                        </div>
                        <p className="font-bold text-gray-900">Shadiyarana Admin</p>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
                    <p className="mt-1 text-sm text-gray-500">Sign in to your admin account to continue</p>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">Phone number</label>
                            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 focus-within:border-gray-900 focus-within:bg-white transition-colors">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <input type="text" required value={form.phone}
                                    onChange={e => setForm({ ...form, phone: e.target.value })}
                                    placeholder="+92 300 1234567"
                                    className="w-full bg-transparent text-sm outline-none placeholder-gray-400" />
                            </div>
                        </div>

                        <div>
                            <div className="mb-1.5 flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700">Password</label>
                                <a href="#" className="text-xs font-medium text-indigo-600 hover:underline">Forgot?</a>
                            </div>
                            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 focus-within:border-gray-900 focus-within:bg-white transition-colors">
                                <Lock className="h-4 w-4 text-gray-400" />
                                <input type="password" required value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full bg-transparent text-sm outline-none placeholder-gray-400" />
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-700">{error}</div>
                        )}

                        <button type="submit" disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60">
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign in'}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-xs text-gray-400">
                        Protected area. Authorized personnel only.
                    </p>
                </div>
            </div>
        </div>
    )
}
