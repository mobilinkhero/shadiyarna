import Link from 'next/link'

const steps = [
    { step: '01', emoji: '🔍', title: 'Search & Discover', desc: 'Browse thousands of verified vendors. Filter by city, category, budget, and ratings to find your perfect match.' },
    { step: '02', emoji: '📦', title: 'Compare Packages', desc: 'View detailed packages side by side, read genuine reviews, and shortlist your favourites.' },
    { step: '03', emoji: '📅', title: 'Book Securely', desc: 'Select your date, choose a package, and send a booking request directly to the vendor.' },
    { step: '04', emoji: '🎉', title: 'Celebrate!', desc: 'Enjoy your perfect wedding day. Share your experience and help other couples find great vendors.' },
]

export default function HowItWorks() {
    return (
        <section className="bg-[#F8F7F4] py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="mb-12 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">How It Works</h2>
                    <p className="mt-3 text-gray-500">Plan your dream wedding in 4 simple steps</p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {steps.map(({ step, emoji, title, desc }) => (
                        <div key={step} className="relative rounded-2xl bg-white p-6 shadow-sm">
                            <div className="mb-4 text-4xl">{emoji}</div>
                            <span className="mb-2 inline-block rounded-full bg-[#FFF8EE] px-2.5 py-0.5 text-xs font-bold text-[#B8860B]">
                                Step {step}
                            </span>
                            <h3 className="mt-2 font-bold text-gray-900">{title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-gray-500">{desc}</p>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-12 overflow-hidden rounded-3xl bg-gray-900">
                    <div className="relative px-8 py-12 text-center md:py-16">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=60')] bg-cover bg-center opacity-10" />
                        <div className="relative">
                            <h3 className="mb-3 text-2xl font-bold text-white md:text-3xl">Ready to Plan Your Dream Wedding?</h3>
                            <p className="mb-8 text-gray-400">Join 10,000+ couples who found their perfect vendors on Shadiyarana</p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Link href="/vendors" className="rounded-full bg-[#B8860B] px-8 py-3 font-semibold text-white transition-all hover:bg-[#D4A017] hover:shadow-lg hover:shadow-[#B8860B]/25">
                                    Find Vendors
                                </Link>
                                <Link href="/about" className="rounded-full border border-white/20 bg-white/10 px-8 py-3 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20">
                                    Learn More
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
