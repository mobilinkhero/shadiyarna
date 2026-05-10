'use client'

import { useEffect, useState } from 'react'
import { MessageSquare, Clock } from 'lucide-react'
import PageHeader from '@/components/admin/PageHeader'

interface Chat {
    id: string; lastMessage?: string | null; lastMessageAt?: string | null; createdAt: string
    user: { id: string; name?: string | null; phone: string; avatar?: string | null }
    vendor: { id: string; name: string; imageUrl: string }
    _count: { messages: number }
}

export default function AdminMessagesPage() {
    const [chats, setChats] = useState<Chat[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            const token = document.cookie.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1] ?? ''
            const res = await fetch('/api/admin/messages', { headers: { Authorization: `Bearer ${token}` } })
            const json = await res.json()
            if (json.success) setChats(json.data)
            setLoading(false)
        }
        load()
    }, [])

    return (
        <div>
            <PageHeader title="Messages" description="User-vendor conversations" />

            {loading ? (
                <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">Loading...</div>
            ) : chats.length === 0 ? (
                <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
                    <MessageSquare className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                    <p className="text-sm font-medium text-gray-700">No conversations yet</p>
                    <p className="mt-1 text-xs text-gray-400">User-vendor chats will appear here</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                    {chats.map(chat => (
                        <div key={chat.id} className="flex items-center gap-3 border-b border-gray-100 px-4 py-3 last:border-b-0 hover:bg-gray-50">
                            <div className="flex -space-x-2">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-amber-400 to-rose-400 text-xs font-bold text-white">
                                    {(chat.user.name ?? chat.user.phone)[0].toUpperCase()}
                                </div>
                                <img src={chat.vendor.imageUrl} alt="" className="h-9 w-9 rounded-full border-2 border-white object-cover" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-gray-900">
                                    {chat.user.name ?? chat.user.phone} ⇄ {chat.vendor.name}
                                </p>
                                <p className="truncate text-sm text-gray-500">{chat.lastMessage ?? 'No messages yet'}</p>
                            </div>
                            <div className="text-right text-xs text-gray-400">
                                <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {chat.lastMessageAt ? new Date(chat.lastMessageAt).toLocaleDateString() : '—'}
                                </div>
                                <p className="mt-0.5">{chat._count.messages} messages</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
