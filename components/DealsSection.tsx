import Link from 'next/link'
import { Tag, Clock } from 'lucide-react'

const deals = [
    { vendor: 'Royal Palm Hall', offer: '20% off on Walima packages', newPrice: 'Rs. 360,000', oldPrice: 'Rs. 450,000', slug: 'royal-palm-hall' },
    { vendor: 'Dreamy Clicks Photography', offer: 'Free drone coverage with Elite package', newPrice: 'Rs. 195,000', oldPrice: 'Rs. 220,000', slug: 'dreamy-clicks-photography' },
    { vendor: 'Zafran Catering', offer: 'Complimentary dessert counter', newPrice: 'Rs. 1,100/head', oldPrice: 'Rs. 1,200/head', slug: 'zafran-catering' },
]

export default function DealsSection() {
    return (
        <section className="bg-white py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#6B0F2B] via-[#8B1A4A] to-[#B8860B]">
                    <div className="px-8 py-10 md:px-12">
                        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                                    <Tag className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white sm:text-2xl">Limited Time Offers</h2>
                                    <p className="text-sm text-white/70">Exclusive deals for early bookings</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 backdrop-blur-sm">
                                <Clock className="h-4 w-4 text-white" />
                                <span className="text-sm font-medium text-white">Ends in 3 days</span>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            {deals.map((deal, i) => (
                                <Link key={i} href={`/vendors/${deal.slug}`}
                                    className="group rounded-2xl bg-white/10 p-5 backdrop-blur-sm transition-all hover:bg-white/20">
                                    <p className="font-bold text-white">{deal.vendor}</p>
                                    <p className="mt-1 text-sm text-white/75">{deal.offer}</p>
                                    <div className="mt-4 flex items-baseline gap-2">
                                        <span className="text-xl font-bold text-white">{deal.newPrice}</span>
                                        <span className="text-sm text-white/50 line-through">{deal.oldPrice}</span>
                                    </div>
                                    <span className="mt-3 inline-block text-xs font-semibold text-white/80 group-hover:text-white">
                                        View deal →
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
