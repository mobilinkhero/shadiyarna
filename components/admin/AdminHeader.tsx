'use client'

import { Bell, Search, User } from 'lucide-react'
import { useState } from 'react'

export default function AdminHeader() {
    const [searchQuery, setSearchQuery] = useState('')

    return (
        <header className="sticky top-0 z-40 border-b bg-white">
            <div className="flex h-16 items-center justify-between px-6">
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="search"
                            placeholder="Search..."
                            className="h-10 w-64 rounded-lg border border-gray-300 bg-gray-50 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <button className="relative rounded-full p-2 hover:bg-gray-100">
                        <Bell className="h-5 w-5 text-gray-600" />
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                            3
                        </span>
                    </button>

                    <div className="h-8 w-px bg-gray-300" />

                    <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                            <User className="h-4 w-4" />
                        </div>
                        <div className="hidden md:block">
                            <p className="text-sm font-medium">Admin User</p>
                            <p className="text-xs text-gray-500">Super Admin</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}