import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SiteChrome from '@/components/SiteChrome'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Shadiyarana - Your Perfect Wedding Planning Platform',
    description: 'Find the best wedding vendors, venues, caterers, photographers and more for your dream wedding.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <SiteChrome>{children}</SiteChrome>
            </body>
        </html>
    )
}
