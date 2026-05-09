import { Search, Calendar, MessageSquare, CheckCircle } from 'lucide-react'

const steps = [
    {
        id: 1,
        title: 'Search & Discover',
        description: 'Browse thousands of verified wedding vendors across all categories. Filter by location, budget, and ratings.',
        icon: Search,
        color: 'bg-blue-100 text-blue-600'
    },
    {
        id: 2,
        title: 'Compare & Book',
        description: 'Compare vendor profiles, packages, and reviews. Book your preferred vendor with secure payment options.',
        icon: Calendar,
        color: 'bg-amber-100 text-amber-600'
    },
    {
        id: 3,
        title: 'Communicate & Plan',
        description: 'Directly communicate with vendors through our messaging system. Plan details and coordinate seamlessly.',
        icon: MessageSquare,
        color: 'bg-green-100 text-green-600'
    },
    {
        id: 4,
        title: 'Celebrate & Review',
        description: 'Enjoy your perfect wedding day! Share your experience and help other couples by reviewing vendors.',
        icon: CheckCircle,
        color: 'bg-purple-100 text-purple-600'
    }
]

export default function HowItWorks() {
    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <div className="mb-12 text-center">
                    <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                        How It Works
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-gray-600">
                        Simple steps to plan your perfect wedding with Shadiyarana
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {steps.map((step) => (
                        <div
                            key={step.id}
                            className="group rounded-2xl bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl"
                        >
                            <div className="mb-6 flex items-center justify-center">
                                <div className={`rounded-xl p-4 ${step.color}`}>
                                    <step.icon className="h-10 w-10" />
                                </div>
                            </div>
                            <div className="mb-4 text-center">
                                <div className="mb-2 inline-flex items-center rounded-full bg-gray-100 px-3 py-1">
                                    <span className="text-sm font-medium text-gray-700">Step {step.id}</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                            </div>
                            <p className="text-center text-gray-600">{step.description}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-12 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-700 p-8 text-center">
                    <h3 className="mb-4 text-2xl font-bold text-white">Ready to Start Planning?</h3>
                    <p className="mb-6 text-amber-100">
                        Join thousands of couples who found their perfect vendors through Shadiyarana
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button className="rounded-lg bg-white px-6 py-3 font-semibold text-amber-700 hover:bg-gray-100">
                            Create Free Account
                        </button>
                        <button className="rounded-lg bg-transparent border border-white px-6 py-3 font-semibold text-white hover:bg-white/10">
                            Browse Vendors
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}