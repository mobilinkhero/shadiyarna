'use client'

import { Upload, X, Plus } from 'lucide-react'
import { useState } from 'react'

interface Props {
    value: string[]
    onChange: (urls: string[]) => void
    label?: string
}

export default function GalleryPicker({ value, onChange, label = 'Gallery' }: Props) {
    const [uploading, setUploading] = useState(false)
    const [urlInput, setUrlInput] = useState('')

    async function handleFiles(files: FileList) {
        setUploading(true)
        try {
            const token = document.cookie.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1]
            const uploadedUrls: string[] = []
            for (const file of Array.from(files)) {
                const fd = new FormData()
                fd.append('file', file)
                const res = await fetch('/api/admin/upload', {
                    method: 'POST',
                    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                    body: fd,
                })
                const json = await res.json()
                if (res.ok) uploadedUrls.push(json.url)
            }
            onChange([...value, ...uploadedUrls])
        } finally { setUploading(false) }
    }

    function addFromUrl() {
        if (!urlInput.trim()) return
        onChange([...value, urlInput.trim()])
        setUrlInput('')
    }

    function remove(i: number) {
        onChange(value.filter((_, idx) => idx !== i))
    }

    return (
        <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {value.map((img, i) => (
                    <div key={i} className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200">
                        <img src={img} alt="" className="h-full w-full object-cover" />
                        <button type="button" onClick={() => remove(i)}
                            className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100">
                            <X className="h-3 w-3" />
                        </button>
                    </div>
                ))}

                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100">
                    {uploading ? (
                        <span className="text-xs text-gray-500">Uploading...</span>
                    ) : (
                        <>
                            <Upload className="mb-1 h-5 w-5 text-gray-400" />
                            <span className="text-xs text-gray-500">Add</span>
                        </>
                    )}
                    <input type="file" accept="image/*" multiple className="hidden"
                        onChange={e => { if (e.target.files) handleFiles(e.target.files) }} />
                </label>
            </div>

            <div className="mt-2 flex gap-2">
                <input type="url" value={urlInput} onChange={e => setUrlInput(e.target.value)}
                    placeholder="Paste image URL..."
                    className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400" />
                <button type="button" onClick={addFromUrl}
                    className="flex items-center gap-1 rounded-xl bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200">
                    <Plus className="h-4 w-4" /> Add
                </button>
            </div>
        </div>
    )
}
