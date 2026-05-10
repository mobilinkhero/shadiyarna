'use client'

import { useState } from 'react'
import { Send, CheckCircle, Loader2, Bell } from 'lucide-react'
import PageHeader from '@/components/admin/PageHeader'

export default function AdminNotificationsPage() {
    const [form, setForm] = useState({
        title: '', message: '', type: 'INFO', targetRole: 'ALL', link: '',
    })
    const [sending, setSending] = useState(false)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')

    async function send(e: React.FormEvent) {
        e.preventDefault()
        setSending(true); setError(''); setSuccess('')
        try {
            const token = document.cookie.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1] ?? ''
            const res = await fetch('/api/admin/notifications/broadcast', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(form),
            })
            const json = await res.json()
            if (!res.ok) throw new Error(json.error)
            setSuccess(`Sent to ${json.sentTo} users`)
            setForm({ title: '', message: '', type: 'INFO', targetRole: 'ALL', link: '' })
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Send failed')
        } finally { setSending(false) }
    }

    return (
        <div>
            <PageHeader title="Broadcast Notifications" description="Send a push notification to all users, vendors, or specific roles" />

            <div className="mx-auto max-w-2xl">
                <form onSubmit={send} className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">Send to</label>
                            <select value={form.targetRole} onChange={e => setForm({ ...form, targetRole: e.target.value })}
                                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400">
                                <option value="ALL">All users</option>
                                <option value="USER">Users only</option>
                                <option value="VENDOR">Vendors only</option>
                            </select>
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">Type</label>
                            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400">
                                <option value="INFO">Info</option>
                                <option value="SUCCESS">Success</option>
                                <option value="WARNING">Warning</option>
                                <option value="ERROR">Error</option>
                                <option value="BOOKING">Booking</option>
                                <option value="MESSAGE">Message</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">Title *</label>
                        <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required
                            placeholder="New feature launched!"
                            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400" />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">Message *</label>
                        <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required rows={3}
                            placeholder="We just launched something amazing..."
                            className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400" />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">Link (optional)</label>
                        <input value={form.link} onChange={e => setForm({ ...form, link: e.target.value })}
                            placeholder="/vendors or https://..."
                            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400" />
                    </div>

                    {error && <div className="rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-700">{error}</div>}
                    {success && (
                        <div className="flex items-center gap-2 rounded-xl bg-green-50 px-3 py-2.5 text-sm text-green-700">
                            <CheckCircle className="h-4 w-4" /> {success}
                        </div>
                    )}

                    <button type="submit" disabled={sending || !form.title || !form.message}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60">
                        {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        Send Notification
                    </button>
                </form>

                {/* Preview */}
                {(form.title || form.message) && (
                    <div className="mt-6">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Preview</p>
                        <div className="rounded-xl border border-gray-200 bg-white p-4">
                            <div className="flex items-start gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-rose-100">
                                    <Bell className="h-4 w-4 text-amber-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-gray-900">{form.title || 'Notification title'}</p>
                                    <p className="mt-0.5 text-sm text-gray-600">{form.message || 'Notification message'}</p>
                                    <p className="mt-1 text-xs text-gray-400">Just now</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
