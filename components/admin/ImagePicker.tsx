'use client'

import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { useState } from 'react'

interface Props {
    value: string
    onChange: (url: string) => void
    label?: string
    aspectRatio?: 'square' | 'wide'
}

export default function ImagePicker({ value, onChange, label = 'Image', aspectRatio = 'wide' }: Props) {
    const [uploading, setUploading] = useState(false)
    const [urlInput, setUrlInput] = useState('')
    const [error, setError] = useState('')

    async function handleFile(file: File) {
        setUploading(true); setError('')
        try {
            const token = document.cookie.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1]
            const fd = new FormData()
            fd.append('file', file)
            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                body: fd,
            })
            const json = await res.json()
            if (!res.ok) throw new Error(json.error || 'Upload failed')
            onChange(json.url)
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Upload failed')
        } finally { setUploading(false) }
    }

    function addFromUrl() {
        if (!urlInput.trim()) return
        onChange(urlInput.trim())
        setUrlInput('')
    }

    const aspect = aspectRatio === 'square' ? 'aspect-square' : 'aspect-[16/9]'

    return (
        <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
            {value ? (
                <div className={`relative ${aspect} overflow-hidden rounded-xl border border-gray-200`}>
                    <img src={value} alt="" className="h-full w-full object-cover" />
                    <button type="button" onClick={() => onChange('')}
                        className="absolute right-2 top-2 rounded-full bg-white/95 p-1.5 shadow-sm hover:bg-white">
                        <X className="h-4 w-4 text-gray-700" />
                    </button>
                </div>
            ) : (
                <div>
                    <label className={`flex ${aspect} cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 transition-all hover:border-gray-300 hover:bg-gray-100`}>
                        {uploading ? (
                            <span className="text-sm text-gray-500">Uploading...</span>
                        ) : (
                            <>
                                <Upload className="mb-1 h-6 w-6 text-gray-400" />
                                <span className="text-sm font-medium text-gray-600">Click to upload</span>
                                <span className="text-xs text-gray-400">PNG, JPG up to 5MB</span>
                            </>
                        )}
                        <input type="file" accept="image/*" className="hidden"
                            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
                    </label>

                    <div className="mt-2 flex gap-2">
                        <input type="url" value={urlInput} onChange={e => setUrlInput(e.target.value)}
                            placeholder="Or paste image URL..."
                            className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400" />
                        <button type="button" onClick={addFromUrl}
                            className="rounded-xl bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200">
                            Add
                        </button>
                    </div>
                </div>
            )}
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    )
}
