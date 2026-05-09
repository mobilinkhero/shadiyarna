import { Star, Quote } from 'lucide-react'

const testimonials = [
    {
        id: 1,
        name: 'Ayesha & Ahmed',
        weddingDate: 'December 2024',
        location: 'Karachi',
        content: 'Shadiyarana made our wedding planning stress-free! We found the perfect photographer and caterer through the platform. The vendor quality was exceptional.',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
    },
    {
        id: 2,
        name: 'Sara & Ali',
        weddingDate: 'November 2024',
        location: 'Lahore',
        content: 'As a busy couple, we needed a one-stop solution for wedding planning. Shadiyarana exceeded our expectations with verified vendors and excellent support.',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
    },
    {
        id: 3,
        name: 'Fatima & Hassan',
        weddingDate: 'October 2024',
        location: 'Islamabad',
        content: 'The platform helped us stay within budget while finding top-quality vendors. The booking process was smooth and secure. Highly recommended!',
        rating: 4,
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
    },
    {
        id: 4,
        name: 'Zainab & Usman',
        weddingDate: 'September 2024',
        location: 'Karachi',
        content: 'We planned our entire wedding through Shadiyarana. From venue to decor, everything was perfect. The vendor reviews helped us make informed decisions.',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
    }
]

export default function Testimonials() {
    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="mb-12 text-center">
                    <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                        Real Stories from Happy Couples
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-gray-600">
                        See what couples are saying about their Shadiyarana experience
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="rounded-2xl bg-white p-6 shadow-sm"
                        >
                            <div className="mb-6 flex items-center">
                                <div className="mr-4 h-12 w-12 overflow-hidden rounded-full">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                                    <p className="text-sm text-gray-600">
                                        {testimonial.weddingDate} • {testimonial.location}
                                    </p>
                                </div>
                                <div className="ml-auto">
                                    <Quote className="h-8 w-8 text-amber-300" />
                                </div>
                            </div>

                            <div className="mb-4 flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-5 w-5 ${i < testimonial.rating
                                                ? 'fill-amber-500 text-amber-500'
                                                : 'fill-gray-200 text-gray-200'
                                            }`}
                                    />
                                ))}
                            </div>

                            <p className="text-gray-700">{testimonial.content}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <div className="inline-flex flex-wrap items-center justify-center gap-6 rounded-2xl bg-white p-8 shadow-sm">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-gray-900">4.8/5</p>
                            <p className="text-sm text-gray-600">Average Rating</p>
                        </div>
                        <div className="h-12 w-px bg-gray-200"></div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-gray-900">2,500+</p>
                            <p className="text-sm text-gray-600">Weddings Planned</p>
                        </div>
                        <div className="h-12 w-px bg-gray-200"></div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-gray-900">98%</p>
                            <p className="text-sm text-gray-600">Customer Satisfaction</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}