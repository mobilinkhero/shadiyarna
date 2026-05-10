import { Search, CalendarCheck, MessageCircle, PartyPopper } from 'lucide-react'

const steps = [
    {
        step: '01',
        icon: Search,
        title: 'Search & Discover',
        desc: 'Browse thousands of verified vendors. Filter by city, category, budget, and ratings to find your perfect match.',
        color: 'bg-blue-500',
        light: 'bg-blue-50 text-blue-600',
    },
    {
        step: '02',
        icon: CalendarCheck,
        title: 'Compare & Book',
        desc: 'Compare packages side by side, read real reviews, and book securely with just a few taps.',
        color: 'bg-amber-500',
        light: 'bg-amber-50 text-amber-600',
    },
    {
        step: '03',
        icon: MessageCircle,
        title: 'Chat & Plan',
        desc: 'Message vendors directly, share your vision, and coordinate every detail through our platform.',
        color: 'bg-green-500',
        light: 'bg-green-50 text-green-600',
    },
    {
        step: '04',
        icon: PartyPopper,
        title: 'Celebrate!',
        desc: 'Enjoy your perfect wedding day. Share your experience and help other couples find great vendors.',
        color: 'bg-purple-500',
        light: 'bg-purple-50 text-purple-600',
    },
]

export default function HowItWorks() {
    return (
        <section className="bg-gray-50 py-20">
            <div className="container mx-auto px-4">
                <div className="mb-14 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">How It Works</h2>
                    <p className="mt-3 text-gray-500">Plan your dream wedding in 4 simple steps</p>
                </div>

                <div className="relative">
                    {/* Connector line */}
                    <div className="absolute left-1/2 top-16 hidden h-0.5 w-3/4 -translate-x-1/2 bg-gradient-to-r from-blue-200 via-amber-200 to-purple-200 lg:block" />

                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {steps.map(({ step, icon: Icon, title, desc, color, light }) => (
                            <div key={step} className="relative flex flex-col items-center text-center">
                                {/* Step number */}
                                <div className="relative mb-6">
                                    <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${color} shadow-lg`}>
                                        <Icon className="h-8 w-8 text-white" />
                                    </div>
                                    <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-gray-700 shadow-md ring-2 ring-gray-100">
                                        {step}
                                    </span>
                                </div>
                                <h3 className="mb-2 text-lg font-bold text-gray-900">{title}</h3>
                                <p className="text-sm leading-relaxed text-gray-500">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA banner */}
                <div className="mt-16 overflow-hidden rounded-3xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
                    <div className="relative px-8 py-12 text-center md:py-16">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=60')] bg-cover bg-center opacity-10" />
                        <div className="relative">
                            <h3 className="mb-3 text-2xl font-bold text-white md:text-3xl">
                                Ready to Plan Your Dream Wedding?
                            </h3>
                            <p className="mb-8 text-gray-400">
                                Join 10,000+ couples who found their perfect vendors on Shadiyarana
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <a href="/vendors" className="rounded-full bg-amber-500 px-8 py-3 font-semibold text-white transition-all hover:bg-amber-600 hover:shadow-lg hover:shadow-amber-500/25">
                                    Find Vendors
                                </a>
                                <a href="/about" className="rounded-full border border-white/20 bg-white/10 px-8 py-3 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20">
                                    Learn More
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
