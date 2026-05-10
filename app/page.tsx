import HeroSection from '@/components/HeroSection'
import CategoriesSection from '@/components/CategoriesSection'
import FeaturedVendors from '@/components/FeaturedVendors'
import DealsSection from '@/components/DealsSection'
import HowItWorks from '@/components/HowItWorks'
import Testimonials from '@/components/Testimonials'

export default function Home() {
    return (
        <div>
            <HeroSection />
            <CategoriesSection />
            <FeaturedVendors
                title="Featured Vendors"
                subtitle="Handpicked, verified, and loved by couples across Pakistan"
                filter="featured"
            />
            <DealsSection />
            <FeaturedVendors
                title="Top Rated Vendors"
                subtitle="Consistently excellent — rated 4.7+ by real couples"
                filter="top"
            />
            <HowItWorks />
            <Testimonials />
        </div>
    )
}
