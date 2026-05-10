import { Star, Quote } from 'lucide-react'

const testimonials = [
    { name: 'Ayesha & Ahmed', date: 'December 2024 · Karachi', text: 'Shadiyarana made our wedding planning completely stress-free. We found our photographer, caterer, and decorator all in one place. The vendors were professional and the quality exceeded our expectations!', rating: 5, avatar: 'AK', color: 'bg-rose-100 text-rose-700' },
    { name: 'Sara & Ali', date: 'November 2024 · Lahore', text: 'As a busy couple, we needed a one-stop solution. Shadiyarana delivered exactly that. The verified vendor badges gave us confidence, and the booking process was seamless.', rating: 5, avatar: 'SA', color: 'bg-blue-100 text-blue-700' },
    { name: 'Fatima & Hassan', date: 'October 2024 · Islamabad', text: 'We planned our entire wedding through Shadiyarana. The vendor reviews were genuine and helped us make informed decisions. Our wedding day was absolutely perfect!', rating: 5, avatar: 'FH', color: 'bg-amber-100 text-amber-700' },
    { name: 'Zainab & Usman', date: 'September 2024 · Karachi', text: 'The platform is incredibly easy to use. We compared multiple vendors, read reviews, and booked everything within a week. Highly recommend to every couple planning their wedding.', rating: 5, avatar: 'ZU', color: 'bg-green-100 text-green-700' },
]

export default function Testimonials() {
    return (
        <section className="bg-white py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="mb-12 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Loved by Couples</h2>
                    <p className="mt-3 text-gray-500">Real stories from real weddings across Pakistan</p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {testimonials.map((t) => (
                        <div key={t.name} className="group relative overflow-hidden rounded-2xl border border-[#EBEBEB] bg-[#F8F7F4] p-6 transition-all hover:border-[#B8860B]/20 hover:shadow-md">
                            <Quote className="absolute right-5 top-5 h-8 w-8 text-gray-100 transition-colors group-hover:text-[#B8860B]/10" />
                            <div className="mb-4 flex gap-0.5">
                                {[...Array(t.rating)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                                ))}
                            </div>
                            <p className="mb-5 leading-relaxed text-gray-700">&ldquo;{t.text}&rdquo;</p>
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

                {/* Trust stats */}
                <div className="mt-12 grid grid-cols-2 gap-4 rounded-2xl bg-gradient-to-r from-[#FFF8EE] to-[#FFF0F8] p-8 sm:grid-cols-4">
                    {[['4.8/5', 'Average Rating'], ['10,000+', 'Weddings Planned'], ['2,500+', 'Verified Vendors'], ['98%', 'Satisfaction Rate']].map(([v, l]) => (
                        <div key={l} className="text-center">
                            <p className="text-2xl font-bold text-gray-900 sm:text-3xl">{v}</p>
                            <p className="mt-1 text-sm text-gray-500">{l}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
