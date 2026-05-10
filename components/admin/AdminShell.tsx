'use client'

import {
    LayoutDashboard, Users, Building2, Tag, Calendar, Star,
    BarChart3, Settings, LogOut, Menu, X, Bell, Search,
    ChevronDown, User, HelpCircle, Plus
} from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const navSections = [
    {
        label: 'Overview',
        items: [
            { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
            { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
        ],
    },
    {
        label: 'Manage',
        items: [
            { name: 'Vendors', href: '/admin/vendors', icon: Building2 },
            { name: 'Categories', href: '/admin/categories', icon: Tag },
            { name: 'Users', href: '/admin/users', icon: Users },
            { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
            { name: 'Reviews', href: '/admin/reviews', icon: Star },
        ],
    },
    {
        label: 'System',
        items: [
            { name: 'Settings', href: '/admin/settings', icon: Settings },
        ],
    },
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [userMenu, setUserMenu] = useState(false)
    const [user, setUser] = useState<{ name?: string; email?: string; phone?: string; role?: string } | null>(null)

    useEffect(() => {
        // Close mobile nav on route change
        setMobileOpen(false)
    }, [pathname])

    useEffect(() => {
        // Read user from cookie-set token if available
        const cookie = document.cookie.split(';').find(c => c.trim().startsWith('token='))
        if (cookie) {
            try {
                const token = cookie.split('=')[1]
                const payload = JSON.parse(atob(token.split('.')[1]))
                setUser(payload)
            } catch { /* ignore */ }
        }
    }, [])

    function logout() {
        document.cookie = 'token=; path=/; max-age=0'
        router.push('/admin/login')
    }

    // Don't render shell on login page
    if (pathname === '/admin/login') return <>{children}</>

    const pageTitle = getPageTitle(pathname)

    return (
        <div className="flex h-screen bg-[#F9FAFB]">

            {/* Mobile overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setMobileOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed z-50 flex h-full w-64 flex-col bg-[#0F172A] transition-transform duration-300 lg:relative lg:translate-x-0
                ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Logo */}
                <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
                    <Link href="/admin" className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600">
                            <span className="text-sm font-bold italic text-white">S</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white leading-none">Shadiyarana</p>
                            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-400">Admin</p>
                        </div>
                    </Link>
                    <button onClick={() => setMobileOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-white/10 lg:hidden">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
                    {navSections.map(section => (
                        <div key={section.label}>
                            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                {section.label}
                            </p>
                            <div className="space-y-0.5">
                                {section.items.map(item => {
                                    const Icon = item.icon
                                    const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
                                    return (
                                        <Link key={item.name} href={item.href}
                                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                                                isActive
                                                    ? 'bg-white/10 text-white'
                                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                            }`}>
                                            <Icon className="h-4 w-4" />
                                            <span>{item.name}</span>
                                            {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-400" />}
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Bottom user card */}
                <div className="border-t border-white/10 p-3">
                    <div className="flex items-center gap-3 rounded-lg bg-white/5 p-2.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-rose-400 text-sm font-bold text-white">
                            {(user?.name ?? user?.phone ?? 'A')[0].toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-white">{user?.name ?? 'Admin'}</p>
                            <p className="truncate text-xs text-slate-400">{user?.role ?? 'SUPER_ADMIN'}</p>
                        </div>
                        <button onClick={logout} className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white" title="Logout">
                            <LogOut className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main column */}
            <div className="flex flex-1 flex-col overflow-hidden">

                {/* Top bar */}
                <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#E5E7EB] bg-white px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setMobileOpen(true)} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 lg:hidden">
                            <Menu className="h-5 w-5" />
                        </button>
                        <div>
                            <h1 className="text-base font-semibold text-gray-900">{pageTitle}</h1>
                            <p className="hidden text-xs text-gray-500 sm:block">Welcome back, manage your platform</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Search */}
                        <div className="hidden items-center gap-2 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-1.5 md:flex">
                            <Search className="h-4 w-4 text-gray-400" />
                            <input type="search" placeholder="Search..."
                                className="w-48 bg-transparent text-sm outline-none placeholder-gray-400" />
                            <kbd className="rounded bg-white border border-[#E5E7EB] px-1.5 py-0.5 text-[10px] font-mono text-gray-500">⌘K</kbd>
                        </div>

                        {/* Help */}
                        <button className="rounded-lg p-2 text-gray-500 hover:bg-gray-100" title="Help">
                            <HelpCircle className="h-5 w-5" />
                        </button>

                        {/* Notifications */}
                        <button className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100" title="Notifications">
                            <Bell className="h-5 w-5" />
                            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                        </button>

                        {/* Quick add */}
                        <Link href="/admin/vendors/new"
                            className="hidden items-center gap-2 rounded-xl bg-gray-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-gray-800 sm:flex">
                            <Plus className="h-4 w-4" /> Add Vendor
                        </Link>

                        {/* User menu */}
                        <div className="relative">
                            <button onClick={() => setUserMenu(!userMenu)}
                                className="flex items-center gap-2 rounded-xl border border-[#E5E7EB] px-2 py-1.5 hover:bg-gray-50">
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-rose-400 text-xs font-bold text-white">
                                    {(user?.name ?? user?.phone ?? 'A')[0].toUpperCase()}
                                </div>
                                <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                            </button>
                            {userMenu && (
                                <div className="absolute right-0 top-full mt-1.5 w-56 overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-lg">
                                    <div className="border-b border-[#E5E7EB] p-3">
                                        <p className="text-sm font-semibold text-gray-900">{user?.name ?? 'Admin'}</p>
                                        <p className="truncate text-xs text-gray-500">{user?.email ?? user?.phone ?? ''}</p>
                                    </div>
                                    <div className="py-1">
                                        <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                            <User className="h-4 w-4" /> My Profile
                                        </button>
                                        <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                            <Settings className="h-4 w-4" /> Settings
                                        </button>
                                    </div>
                                    <div className="border-t border-[#E5E7EB] py-1">
                                        <button onClick={logout} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                                            <LogOut className="h-4 w-4" /> Sign out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}

function getPageTitle(pathname: string): string {
    if (pathname === '/admin') return 'Dashboard'
    if (pathname.startsWith('/admin/vendors')) return 'Vendors'
    if (pathname.startsWith('/admin/users')) return 'Users'
    if (pathname.startsWith('/admin/bookings')) return 'Bookings'
    if (pathname.startsWith('/admin/categories')) return 'Categories'
    if (pathname.startsWith('/admin/reviews')) return 'Reviews'
    if (pathname.startsWith('/admin/analytics')) return 'Analytics'
    if (pathname.startsWith('/admin/settings')) return 'Settings'
    return 'Admin'
}
