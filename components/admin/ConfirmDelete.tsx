'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'
import { useState } from 'react'
import Modal from './Modal'

interface Props {
    open: boolean
    onClose: () => void
    onConfirm: () => Promise<void> | void
    title: string
    message: string
    confirmLabel?: string
}

export default function ConfirmDelete({ open, onClose, onConfirm, title, message, confirmLabel = 'Delete' }: Props) {
    const [loading, setLoading] = useState(false)

    async function handleConfirm() {
        setLoading(true)
        try { await onConfirm() } finally { setLoading(false); onClose() }
    }

    return (
        <Modal open={open} onClose={onClose} title={title} maxWidth="sm">
            <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <p className="text-sm text-gray-600">{message}</p>
            </div>
            <div className="mt-6 flex justify-end gap-2">
                <button onClick={onClose} disabled={loading}
                    className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                    Cancel
                </button>
                <button onClick={handleConfirm} disabled={loading}
                    className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {confirmLabel}
                </button>
            </div>
        </Modal>
    )
}
