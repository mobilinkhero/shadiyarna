import Link from 'next/link'
import { Plus } from 'lucide-react'

interface Props {
    title: string
    description?: string
    actionLabel?: string
    actionHref?: string
    onAction?: () => void
}

export default function PageHeader({ title, description, actionLabel, actionHref, onAction }: Props) {
    return (
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
            </div>
            {actionLabel && (
                actionHref ? (
                    <Link href={actionHref}
                        className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800">
                        <Plus className="h-4 w-4" /> {actionLabel}
                    </Link>
                ) : (
                    <button onClick={onAction}
                        className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800">
                        <Plus className="h-4 w-4" /> {actionLabel}
                    </button>
                )
            )}
        </div>
    )
}
