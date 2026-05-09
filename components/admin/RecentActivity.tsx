import { LucideIcon } from 'lucide-react'

interface Activity {
    id: number | string
    user: string
    action: string
    target: string
    time: string
    icon: LucideIcon
    color: string
}

interface RecentActivityProps {
    activities: Activity[]
}

export default function RecentActivity({ activities }: RecentActivityProps) {
    return (
        <div className="space-y-4">
            {activities.map((activity) => {
                const Icon = activity.icon
                return (
                    <div key={activity.id} className="flex items-start space-x-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${activity.color}`}>
                            <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900">
                                    <span className="font-semibold">{activity.user}</span> {activity.action}
                                </p>
                                <span className="text-xs text-gray-500">{activity.time}</span>
                            </div>
                            <p className="mt-1 text-sm text-gray-600">{activity.target}</p>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}