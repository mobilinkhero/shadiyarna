import { Star, Quote } from 'lucide-react'

const testimonials = [
    {
        name: 'Ayesha & Ahmed',
        date: 'December 2024 · Karachi',
        text: 'Shadiyarana made our wedding planning completely stress-free. We found our photographer, caterer, and decorator all in one place. The vendors were professional and the quality exceeded our expectations!',
        rating: 5,
        avatar: 'AK',
        color: 'bg-rose-100 text-rose-700',
    },
    {
        name: 'Sara & Ali',
        date: 'November 2024 · Lahore',
        text: 'As a busy couple, we needed a one-stop solution. Shadiyarana delivered exactly that. The verified vendor badges gave us confidence, and the booking process was seamless.',
        rating: 5,
        avatar: 'SA',
        color: 'bg-blue-100 text-blue-700',
    },
    {
        name: 'Fatima & Hassan',
        date: 'October 2024 · Islamabad',
        text: 'We planned our entire wedding through Shadiyarana. The vendor reviews were genuine and helped us make informed decisions. Our wedding day was absolutely perfect!',
        rating: 5,
        avatar: 'FH',
        color: 'bg-amber-100 text-amber-700',
    },
    {
        name: 'Zainab & Usman',
        date: 'September 2024 · Karachi',
        text: 'The platform is incredibly easy to use. We compared multiple vendors, read reviews, and booked everything within a week. Highly recommend to every couple planning their wedding.',
        rating: 5,
        avatar: 'ZU',
        color: 'bg-green-100 text-green-700',
    },
]

export default function Testimonials() {
    return (
        <section className="bg-white py-20">
            <div className="container mx-auto px-4">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Loved by Couples</h2>
                    <p className="mt-3 text-gray-500">Real stories from real weddings across Pakistan</p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {testimonials.map((t) => (
                        <div key={t.name} className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 p-6 transition-all hover:border-amber-200 hover:bg-amber-50/30 hover:shadow-lg">
                            <Quote className="absolute right-6 top-6 h-10 w-10 text-gray-100 transition-colors group-hover:text-amber-100" />

                            {/* Stars */}
                            <div className="mb-4 flex gap-1">
                                {[...Array(t.rating)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                                ))}
                            </div>

                            <p className="mb-6 leading-relaxed text-gray-700">&ldquo;{t.text}&rdquo;</p>

                            <div className="flex items-center gap-3">
                                <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${t.color}`}>
                                    {t.avatar}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{t.name}</p>
                                    <p className="text-sm text-gray-500">{t.date}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Trust bar */}
                <div className="mt-12 rounded-2xl bg-gradient-to-r from-amber-50 to-rose-50 p-8">
                    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
                        {[
                            { value: '4.8/5', label: 'Average Rating' },
                            { value: '10,000+', label: 'Weddings Planned' },
                            { value: '2,500+', label: 'Verified Vendors' },
                            { value: '98%', label: 'Satisfaction Rate' },
                        ].map(({ value, label }) => (
                            <div key={label} className="text-center">
                                <p className="text-3xl font-bold text-gray-900">{value}</p>
                                <p className="mt-1 text-sm text-gray-500">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
