'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const banners = [
    {
        title: 'Plan your dream wedding\nwith Shadiyarana',
        sub: 'Explore Now',
        href: '/vendors',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80',
    },
    {
        title: 'Find the best venues\nin your city',
        sub: 'Browse Venues',
        href: '/vendors?category=venues',
        image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&q=80',
    },
    {
        title: 'Book top photographers\nfor your big day',
        sub: 'See Photographers',
        href: '/vendors?category=photography',
        image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400&q=80',
    },
]

export default function HeroSection() {
    const [current, setCurrent] = useState(0)
    const router = useRouter()

    useEffect(() => {
        const t = setInterval(() => setCurrent(i => (i + 1) % banners.length), 4000)
        return () => clearInterval(t)
    }, [])

    const banner = banners[current]

    return (
        <div className="relative h-44 overflow-hidden md:h-52" style={{ background: 'linear-gradient(135deg, #8B1A4A, #D4A017)' }}>
            {/* Background image */}
            <div
                className="absolute right-0 top-0 bottom-0 w-36 md:w-48 transition-all duration-500"
                style={{
                    backgroundImage: `url(${banner.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'brightness(0.7)',
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />

            {/* Content */}
            <div className="relative flex h-full flex-col justify-center px-6 md:px-8">
                <p className="mb-3 whitespace-pre-line text-lg font-bold leading-tight text-white md:text-2xl">
                    {banner.title}
                </p>
                <Link
                    href={banner.href}
                    className="inline-flex w-fit items-center rounded-full px-5 py-2 text-sm font-semibold text-white"
                    style={{ backgroundColor: '#E91E8C' }}
                >
                    {banner.sub}
                </Link>
            </div>

            {/* Dots */}
            <div className="absolute bottom-3 left-6 flex gap-1.5">
                {banners.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-5 bg-white' : 'w-1.5 bg-white/50'}`}
                    />
                ))}
            </div>
        </div>
    )
}
