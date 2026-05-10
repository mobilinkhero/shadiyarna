import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AdminShell from '@/components/admin/AdminShell'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Shadiyarana Admin',
    description: 'Admin panel for Shadiyarana wedding planning platform',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <AdminShell>{children}</AdminShell>
            </body>
        </html>
    )
}
