import Link from 'next/link'

const deals = [
    { vendor: 'Royal Palm Hall', offer: '20% off on Walima packages', newPrice: 'Rs. 360,000', oldPrice: 'Rs. 450,000' },
    { vendor: 'Dreamy Clicks', offer: 'Free drone coverage with Elite pkg', newPrice: 'Rs. 195,000', oldPrice: 'Rs. 220,000' },
]

export default function DealsSection() {
    return (
        <section className="px-4 py-6">
            <div
                className="overflow-hidden rounded-2xl p-4"
                style={{ background: 'linear-gradient(135deg, #8B1A4A, #D4A017)' }}
            >
                <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">🏷️</span>
                        <span className="font-bold text-white">Limited Time Offers</span>
                    </div>
                    <span className="rounded-lg bg-white/20 px-2 py-1 text-xs font-medium text-white">Ends in 3 days</span>
                </div>

                <div className="space-y-2 mb-4">
                    {deals.map((deal, i) => (
                        <div key={i} className="rounded-xl bg-white/10 p-3">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-white">{deal.vendor}</p>
                                    <p className="text-xs text-white/80">{deal.offer}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-white">{deal.newPrice}</p>
                                    <p className="text-xs text-white/60 line-through">{deal.oldPrice}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <Link
                    href="/vendors"
                    className="block w-full rounded-xl bg-white py-2.5 text-center text-sm font-semibold text-[#8B1A4A]"
                >
                    View All Deals
                </Link>
            </div>
        </section>
    )
}
