'use client'

import { useState } from 'react'
import { CheckCircle, ChevronDown } from 'lucide-react'

interface Package {
    id: string; name: string; price: string; originalPrice?: string | null
    description?: string | null; features: string[]; isPopular: boolean
}

export default function PackageSelector({ packages }: { packages: Package[] }) {
    const [selected, setSelected] = useState<string | null>(null)
    const [expanded, setExpanded] = useState<string | null>(null)

    const icons = ['🏆', '💎', '⭐', '🌟']

    return (
        <div className="grid gap-4 sm:grid-cols-2">
            {packages.map((pkg, idx) => {
                const isSelected = selected === pkg.id
                const isExpanded = expanded === pkg.id

                return (
                    <div
                        key={pkg.id}
                        onClick={() => {
                            setSelected(pkg.id)
                            setExpanded(isExpanded ? null : pkg.id)
                        }}
                        className={`relative cursor-pointer overflow-hidden rounded-2xl border-2 p-5 transition-all hover:shadow-md ${
                            isSelected
                                ? 'border-[#B8860B] bg-[#FFF8EE]'
                                : 'border-[#EBEBEB] bg-[#F8F7F4] hover:border-[#B8860B]/40'
                        }`}
                    >
                        {pkg.isPopular && (
                            <div className="absolute right-0 top-0 rounded-bl-xl bg-[#B8860B] px-3 py-1 text-xs font-bold text-white">
                                Most Popular
                            </div>
                        )}

                        <div className="flex items-start gap-3">
                            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl ${isSelected ? 'bg-[#B8860B]' : 'bg-gray-200'}`}>
                                {isSelected
                                    ? <span className="text-white">{icons[idx % icons.length]}</span>
                                    : <span>{icons[idx % icons.length]}</span>
                                }
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={`font-bold ${isSelected ? 'text-[#B8860B]' : 'text-gray-900'}`}>{pkg.name}</p>
                                <div className="flex items-baseline gap-2">
                                    <span className={`text-lg font-bold ${isSelected ? 'text-[#B8860B]' : 'text-[#E91E8C]'}`}>{pkg.price}</span>
                                    {pkg.originalPrice && (
                                        <span className="text-sm text-gray-400 line-through">{pkg.originalPrice}</span>
                                    )}
                                </div>
                            </div>
                            <ChevronDown className={`h-5 w-5 shrink-0 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>

                        {isExpanded && (
                            <div className="mt-4 border-t border-[#EBEBEB] pt-4">
                                {pkg.description && (
                                    <p className="mb-3 text-sm text-gray-600">{pkg.description}</p>
                                )}
                                {pkg.features.length > 0 && (
                                    <ul className="space-y-2">
                                        {pkg.features.map((f, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}
