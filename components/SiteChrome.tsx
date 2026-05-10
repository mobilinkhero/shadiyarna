'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'

export default function SiteChrome({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isAdmin = pathname?.startsWith('/admin')

    if (isAdmin) {
        // Admin routes — no public navbar/footer, admin layout handles its own chrome
        return <>{children}</>
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    )
}
