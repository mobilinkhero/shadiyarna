'use client'

import {
    Home,
    Users,
    Building2,
    Tag,
    Calendar,
    MessageSquare,
    Star,
    Settings,
    BarChart3,
    FileText,
    LogOut,
    Menu,
    X
} from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Vendors', href: '/admin/vendors', icon: Building2 },
    { name: 'Categories', href: '/admin/categories', icon: Tag },
    { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
    { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
    { name: 'Reviews', href: '/admin/reviews', icon: Star },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Reports', href: '/admin/reports', icon: FileText },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminSidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const pathname = usePathname()

    return (
        <>
            {/* Mobile overlay */}
            {isCollapsed && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setIsCollapsed(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed left-0 top-0 z-50 h-screen w-64 transform border-r bg-white transition-transform duration-300 lg:relative lg:translate-x-0
          ${isCollapsed ? '-translate-x-full' : 'translate-x-0'}
        `}
            >
                {/* Sidebar header */}
                <div className="flex h-16 items-center justify-between border-b px-6">
                    <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-600">
                            <Building2 className="h-4 w-4 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">Shadiyarana</h1>
                            <p className="text-xs text-gray-500">Admin Panel</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="rounded-lg p-1 hover:bg-gray-100 lg:hidden"
                    >
                        <X className="h-5 w-5 text-gray-600" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 p-4">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`
                  flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
                  ${isActive
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }
                `}
                                onClick={() => setIsCollapsed(false)}
                            >
                                <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                                <span>{item.name}</span>
                            </Link>
                        )
                    })}
                </nav>

                {/* Sidebar footer */}
                <div className="border-t p-4">
                    <button className="flex w-full items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100">
                        <LogOut className="h-5 w-5 text-gray-500" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Mobile toggle button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="fixed bottom-4 left-4 z-40 rounded-full bg-blue-600 p-3 shadow-lg lg:hidden"
            >
                <Menu className="h-5 w-5 text-white" />
            </button>
        </>
    )
}