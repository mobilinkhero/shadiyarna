'use client'

import { useState } from 'react'
import { Calendar, CheckCircle, Loader2 } from 'lucide-react'

interface Props {
    vendorId: string
    vendorName: string
    vendorSlug: string
}

export default function BookingForm({ vendorId, vendorName, vendorSlug }: Props) {
    const [date, setDate] = useState('')
    const [guests, setGuests] = useState('')
    const [notes, setNotes] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')
    const [showForm, setShowForm] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

            if (!token) {
                // Redirect to login
                window.location.href = `/login?redirect=/vendors/${vendorSlug}`
                return
            }

            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ vendorId, date, guests: guests || undefined, notes: notes || undefined }),
            })

            const json = await res.json()
            if (!res.ok) throw new Error(json.error || 'Booking failed')

            setSuccess(true)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="flex flex-col items-center gap-2 rounded-xl bg-green-50 p-4 text-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <p className="font-semibold text-green-800">Booking Request Sent!</p>
                <p className="text-sm text-green-600">The vendor will contact you shortly.</p>
            </div>
        )
    }

    if (!showForm) {
        return (
            <button
                onClick={() => setShowForm(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:from-amber-600 hover:to-amber-700 hover:shadow-amber-500/30"
            >
                <Calendar className="h-4 w-4" />
                Book Now
            </button>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="font-semibold text-gray-900">Book {vendorName}</p>

            <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Event Date *</label>
                <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
            </div>

            <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Guests (optional)</label>
                <input
                    type="number"
                    value={guests}
                    onChange={e => setGuests(e.target.value)}
                    placeholder="Expected number of guests"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
            </div>

            <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Notes (optional)</label>
                <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Any special requirements..."
                    rows={2}
                    className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
            </div>

            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}

            <div className="flex gap-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-amber-500 py-2 text-sm font-bold text-white hover:bg-amber-600 disabled:opacity-60"
                >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm'}
                </button>
            </div>
        </form>
    )
}
