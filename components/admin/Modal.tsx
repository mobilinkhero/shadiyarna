'use client'

import { X } from 'lucide-react'
import { useEffect } from 'react'

interface Props {
    open: boolean
    onClose: () => void
    title: string
    description?: string
    children: React.ReactNode
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
}

const widths = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-2xl', xl: 'max-w-4xl' }

export default function Modal({ open, onClose, title, description, children, maxWidth = 'md' }: Props) {
    useEffect(() => {
        if (!open) return
        function onEsc(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', onEsc)
        document.body.style.overflow = 'hidden'
        return () => {
            window.removeEventListener('keydown', onEsc)
            document.body.style.overflow = ''
        }
    }, [open, onClose])

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <div className={`w-full ${widths[maxWidth]} max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col`} onClick={e => e.stopPropagation()}>
                <div className="flex items-start justify-between border-b border-gray-100 px-6 py-4">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                        {description && <p className="mt-0.5 text-sm text-gray-500">{description}</p>}
                    </div>
                    <button onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">{children}</div>
            </div>
        </div>
    )
}
