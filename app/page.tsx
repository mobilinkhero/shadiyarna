import HeroSection from '@/components/HeroSection'
import CategoriesSection from '@/components/CategoriesSection'
import FeaturedVendors from '@/components/FeaturedVendors'
import DealsSection from '@/components/DealsSection'
import HowItWorks from '@/components/HowItWorks'
import Testimonials from '@/components/Testimonials'
import Link from 'next/link'
import { Calendar, ChevronRight } from 'lucide-react'

export default function Home() {
    return (
        <div className="bg-[#FAFAFA]">
            {/* Banner carousel */}
            <HeroSection />

            {/* Categories row */}
            <CategoriesSection />

            <div className="h-2 bg-[#F5F5F5]" />

            {/* Trending vendors */}
            <FeaturedVendors title="Trending Now 🔥" filter="featured" />

            <div className="h-2 bg-[#F5F5F5]" />

            {/* Deals & Offers */}
            <DealsSection />

            <div className="h-2 bg-[#F5F5F5]" />

            {/* Upcoming bookings prompt */}
            <section className="px-4 py-4">
                <Link
                    href="/bookings"
                    className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50">
                        <Calendar className="h-6 w-6 text-orange-500" />
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold text-gray-900">Upcoming Events</p>
                        <p className="text-sm text-gray-500">View your bookings & confirmations</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-300" />
                </Link>
            </section>

            <div className="h-2 bg-[#F5F5F5]" />

            {/* Top rated */}
            <FeaturedVendors title="Top Rated Vendors ⭐" filter="top" />

            <div className="h-2 bg-[#F5F5F5]" />

            {/* How it works */}
            <HowItWorks />

            <div className="h-2 bg-[#F5F5F5]" />

            {/* Testimonials */}
            <Testimonials />
        </div>
    )
}
