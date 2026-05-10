import { Star } from 'lucide-react'

const testimonials = [
    { name: 'Ayesha & Ahmed', date: 'Dec 2024 · Karachi', text: 'Shadiyarana made our wedding planning completely stress-free. Found our photographer, caterer, and decorator all in one place!', rating: 5, avatar: 'AK', color: 'bg-rose-100 text-rose-700' },
    { name: 'Sara & Ali', date: 'Nov 2024 · Lahore', text: 'The verified vendor badges gave us confidence. Booking process was seamless and the vendors were incredibly professional.', rating: 5, avatar: 'SA', color: 'bg-blue-100 text-blue-700' },
    { name: 'Fatima & Hassan', date: 'Oct 2024 · Islamabad', text: 'We planned our entire wedding through Shadiyarana. The vendor reviews were genuine and helped us make great decisions.', rating: 5, avatar: 'FH', color: 'bg-amber-100 text-amber-700' },
    { name: 'Zainab & Usman', date: 'Sep 2024 · Karachi', text: 'Compared multiple vendors, read reviews, and booked everything within a week. Highly recommend to every couple!', rating: 5, avatar: 'ZU', color: 'bg-green-100 text-green-700' },
]

export default function Testimonials() {
    return (
        <section className="bg-white px-4 py-8">
            <h2 className="mb-6 text-center text-xl font-bold text-gray-900">Loved by Couples 💕</h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {testimonials.map((t) => (
                    <div key={t.name} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                        <div className="mb-3 flex gap-0.5">
                            {[...Array(t.rating)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                            ))}
                        </div>
                        <p className="mb-4 text-sm leading-relaxed text-gray-700">&ldquo;{t.text}&rdquo;</p>
                        <div className="flex items-center gap-3">
                            <div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${t.color}`}>
                                {t.avatar}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                                <p className="text-xs text-gray-500">{t.date}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-4 gap-3 rounded-2xl bg-gradient-to-r from-[#FFF8EE] to-[#FFF0F8] p-4">
                {[['4.8/5', 'Rating'], ['10K+', 'Couples'], ['2.5K+', 'Vendors'], ['98%', 'Satisfied']].map(([v, l]) => (
                    <div key={l} className="text-center">
                        <p className="text-lg font-bold text-gray-900">{v}</p>
                        <p className="text-xs text-gray-500">{l}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}
