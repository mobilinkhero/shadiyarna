import HeroSection from '@/components/HeroSection'
import FeaturedVendors from '@/components/FeaturedVendors'
import CategoriesSection from '@/components/CategoriesSection'
import HowItWorks from '@/components/HowItWorks'
import Testimonials from '@/components/Testimonials'

export default function Home() {
    return (
        <div>
            <HeroSection />
            <FeaturedVendors />
            <CategoriesSection />
            <HowItWorks />
            <Testimonials />
        </div>
    )
}