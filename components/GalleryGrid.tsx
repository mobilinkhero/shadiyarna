'use client'

import { useState } from 'react'
import { X, ChevronLeft, ChevronRight, Images } from 'lucide-react'

interface Props {
    images: string[]
    vendorName: string
}

export default function GalleryGrid({ images, vendorName }: Props) {
    const [lightbox, setLightbox] = useState<number | null>(null)
    const imgs = images.length > 0 ? images : ['https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80']

    function prev() { setLightbox(i => i !== null ? (i - 1 + imgs.length) % imgs.length : null) }
    function next() { setLightbox(i => i !== null ? (i + 1) % imgs.length : null) }

    return (
        <>
            {/* Grid */}
            <div className="relative h-72 overflow-hidden bg-gray-900 md:h-[420px]">
                <div className={`grid h-full gap-1 ${imgs.length === 1 ? 'grid-cols-1' : imgs.length === 2 ? 'grid-cols-2' : 'grid-cols-4'}`}>
                    {/* Main image */}
                    <div
                        className={`relative cursor-pointer overflow-hidden ${imgs.length >= 3 ? 'col-span-2 row-span-2' : ''}`}
                        onClick={() => setLightbox(0)}
                    >
                        <img src={imgs[0]} alt={vendorName} className="h-full w-full object-cover transition-transform hover:scale-105" />
                        <div className="absolute inset-0 bg-black/0 transition-colors hover:bg-black/10" />
                    </div>
                    {/* Side images */}
                    {imgs.slice(1, 5).map((img, i) => (
                        <div key={i} className="relative cursor-pointer overflow-hidden" onClick={() => setLightbox(i + 1)}>
                            <img src={img} alt={`${vendorName} ${i + 2}`} className="h-full w-full object-cover transition-transform hover:scale-105" />
                            <div className="absolute inset-0 bg-black/0 transition-colors hover:bg-black/10" />
                            {/* Show all button on last visible */}
                            {i === 3 && imgs.length > 5 && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                    <div className="text-center text-white">
                                        <Images className="mx-auto mb-1 h-6 w-6" />
                                        <span className="text-sm font-semibold">+{imgs.length - 5} more</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* View all button */}
                {imgs.length > 1 && (
                    <button
                        onClick={() => setLightbox(0)}
                        className="absolute bottom-4 right-4 flex items-center gap-2 rounded-xl bg-white/90 px-4 py-2 text-sm font-semibold text-gray-800 shadow-lg backdrop-blur-sm transition-all hover:bg-white"
                    >
                        <Images className="h-4 w-4" />
                        View all {imgs.length} photos
                    </button>
                )}
            </div>

            {/* Lightbox */}
            {lightbox !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95" onClick={() => setLightbox(null)}>
                    <button onClick={() => setLightbox(null)} className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20">
                        <X className="h-6 w-6" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); prev() }} className="absolute left-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20">
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <img
                        src={imgs[lightbox]}
                        alt={`${vendorName} ${lightbox + 1}`}
                        className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain"
                        onClick={e => e.stopPropagation()}
                    />
                    <button onClick={(e) => { e.stopPropagation(); next() }} className="absolute right-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20">
                        <ChevronRight className="h-6 w-6" />
                    </button>
                    <div className="absolute bottom-4 text-sm text-gray-400">{lightbox + 1} / {imgs.length}</div>
                </div>
            )}
        </>
    )
}
