import { LucideIcon } from 'lucide-react'

interface StatCardProps {
    title: string
    value: string
    change: string
    icon: LucideIcon
    color: string
    trend: 'up' | 'down'
}

export default function StatCard({
    title,
    value,
    change,
    icon: Icon,
    color,
    trend
}: StatCardProps) {
    return (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
                    <div className="mt-2 flex items-center">
                        <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                            {change}
                        </span>
                        <span className="ml-2 text-sm text-gray-500">from last month</span>
                    </div>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${color}`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
            </div>
        </div>
    )
}