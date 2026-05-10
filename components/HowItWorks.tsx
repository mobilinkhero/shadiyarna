import Link from 'next/link'

const steps = [
    { step: '01', emoji: '🔍', title: 'Search & Discover', desc: 'Browse verified vendors by city, category, and budget.' },
    { step: '02', emoji: '📅', title: 'Compare & Book', desc: 'Compare packages, read reviews, and book securely.' },
    { step: '03', emoji: '💬', title: 'Chat & Plan', desc: 'Message vendors directly and coordinate every detail.' },
    { step: '04', emoji: '🎉', title: 'Celebrate!', desc: 'Enjoy your perfect wedding day.' },
]

export default function HowItWorks() {
    return (
        <section className="bg-[#FAFAFA] px-4 py-8">
            <h2 className="mb-6 text-center text-xl font-bold text-gray-900">How It Works</h2>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {steps.map(({ step, emoji, title, desc }) => (
                    <div key={step} className="rounded-2xl bg-white p-4 text-center shadow-sm">
                        <div className="mb-2 text-3xl">{emoji}</div>
                        <div className="mb-1 inline-block rounded-full bg-[#FFF8EE] px-2 py-0.5 text-xs font-bold text-[#B8860B]">
                            Step {step}
                        </div>
                        <h3 className="mt-1 text-sm font-bold text-gray-900">{title}</h3>
                        <p className="mt-1 text-xs leading-relaxed text-gray-500">{desc}</p>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <div className="mt-6 overflow-hidden rounded-2xl bg-gray-900 p-6 text-center">
                <h3 className="mb-2 text-lg font-bold text-white">Ready to Plan Your Dream Wedding?</h3>
                <p className="mb-4 text-sm text-gray-400">Join 10,000+ couples who found their perfect vendors</p>
                <div className="flex flex-wrap justify-center gap-3">
                    <Link href="/vendors" className="rounded-full bg-[#B8860B] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#D4A017]">
                        Find Vendors
                    </Link>
                    <Link href="/about" className="rounded-full border border-white/20 bg-white/10 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/20">
                        Learn More
                    </Link>
                </div>
            </div>
        </section>
    )
}
