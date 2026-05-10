import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding database...')

    // Categories
    const categories = await Promise.all([
        prisma.category.upsert({ where: { slug: 'venues' }, update: {}, create: { name: 'Venues', slug: 'venues', icon: 'building', sortOrder: 1, isActive: true, description: 'Wedding halls, marquees and banquet halls' } }),
        prisma.category.upsert({ where: { slug: 'photography' }, update: {}, create: { name: 'Photography', slug: 'photography', icon: 'camera', sortOrder: 2, isActive: true, description: 'Wedding photographers and videographers' } }),
        prisma.category.upsert({ where: { slug: 'catering' }, update: {}, create: { name: 'Catering', slug: 'catering', icon: 'utensils', sortOrder: 3, isActive: true, description: 'Food and catering services' } }),
        prisma.category.upsert({ where: { slug: 'makeup' }, update: {}, create: { name: 'Makeup & Hair', slug: 'makeup', icon: 'palette', sortOrder: 4, isActive: true, description: 'Bridal makeup and hair styling' } }),
        prisma.category.upsert({ where: { slug: 'decor' }, update: {}, create: { name: 'Decor & Flowers', slug: 'decor', icon: 'flower', sortOrder: 5, isActive: true, description: 'Wedding decoration and floral arrangements' } }),
        prisma.category.upsert({ where: { slug: 'entertainment' }, update: {}, create: { name: 'Entertainment', slug: 'entertainment', icon: 'music', sortOrder: 6, isActive: true, description: 'Bands, DJs and entertainment' } }),
    ])

    console.log(`✅ ${categories.length} categories created`)

    // Admin user
    const adminPassword = await bcrypt.hash('admin123', 10)
    const admin = await prisma.user.upsert({
        where: { phone: '+923001234567' },
        update: {},
        create: { name: 'Admin User', phone: '+923001234567', email: 'admin@shadiyarana.com', password: adminPassword, role: 'SUPER_ADMIN', isActive: true },
    })
    console.log(`✅ Admin user: phone=+923001234567, password=admin123`)

    // Vendors
    const vendorData = [
        {
            name: 'Royal Palm Hall', slug: 'royal-palm-hall', city: 'Karachi', location: 'DHA Phase 5, Karachi',
            address: 'Street 7, Block 2, DHA Phase 5, Karachi', phone: '+923001111111', email: 'info@royalpalmhall.com',
            about: 'One of Karachi\'s most prestigious wedding venues. Royal Palm Hall offers a luxurious setting with state-of-the-art facilities, accommodating up to 1000 guests. Our experienced team ensures every detail of your special day is perfect.',
            description: 'Premium wedding venue in DHA Karachi with capacity for 1000+ guests.',
            imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80',
            gallery: JSON.stringify(['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80', 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80', 'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=800&q=80', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80', 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80']),
            features: JSON.stringify(['Air Conditioned', 'Parking for 300 cars', 'In-house catering', 'Bridal suite', 'Stage & lighting', 'Backup generator']),
            priceRange: 'PKR 450,000+', minPrice: 450000, maxPrice: 1200000,
            rating: 4.9, totalReviews: 124, isVerified: true, isFeatured: true, respondsQuickly: true,
            workingHours: JSON.stringify({ 'Monday - Friday': '10:00 AM - 10:00 PM', 'Saturday': '9:00 AM - 11:00 PM', 'Sunday': '10:00 AM - 10:00 PM' }),
            details: JSON.stringify({ 'Capacity': '500-1000 guests', 'Venue Type': 'Marquee & Hall', 'Parking': '300 cars', 'Catering': 'In-house available' }),
            categorySlug: 'venues',
            packages: [
                { name: 'Silver Package', price: 'PKR 450,000', description: 'Basic hall booking with standard setup', features: JSON.stringify(['Hall for 500 guests', 'Basic lighting', 'Standard stage', 'Parking']), isPopular: false, sortOrder: 1 },
                { name: 'Gold Package', price: 'PKR 750,000', description: 'Premium setup with full decoration', features: JSON.stringify(['Hall for 750 guests', 'Premium lighting', 'Decorated stage', 'Floral arrangements', 'Bridal suite', 'Parking']), isPopular: true, sortOrder: 2 },
                { name: 'Platinum Package', price: 'PKR 1,200,000', description: 'All-inclusive luxury wedding package', features: JSON.stringify(['Hall for 1000 guests', 'Luxury lighting & decor', 'Grand stage', 'Full floral setup', 'Bridal suite', 'Catering for 500', 'Photography team', 'Valet parking']), isPopular: false, sortOrder: 3 },
            ],
            addons: [
                { name: 'Extra Lighting', price: 'PKR 50,000', description: 'Premium LED lighting upgrade' },
                { name: 'Floral Arch', price: 'PKR 35,000', description: 'Beautiful floral entrance arch' },
                { name: 'Photo Booth', price: 'PKR 25,000', description: 'Fun photo booth for guests' },
            ],
        },
        {
            name: 'Dreamy Clicks Photography', slug: 'dreamy-clicks-photography', city: 'Lahore', location: 'Gulberg III, Lahore',
            address: 'Main Boulevard, Gulberg III, Lahore', phone: '+923002222222', email: 'hello@dreamyclicks.com',
            about: 'Award-winning wedding photography studio based in Lahore. We specialize in capturing authentic moments and emotions that tell your unique love story. With 10+ years of experience and 500+ weddings covered.',
            description: 'Professional wedding photography and videography in Lahore.',
            imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80',
            gallery: JSON.stringify(['https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80', 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&q=80', 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80', 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80']),
            features: JSON.stringify(['4K Video', 'Drone shots', 'Same-day highlights', 'Online gallery', 'Printed album', 'Pre-wedding shoot']),
            priceRange: 'PKR 120,000+', minPrice: 120000, maxPrice: 350000,
            rating: 4.9, totalReviews: 203, isVerified: true, isFeatured: true, respondsQuickly: true,
            workingHours: JSON.stringify({ 'Monday - Saturday': '10:00 AM - 8:00 PM', 'Sunday': 'By appointment' }),
            details: JSON.stringify({ 'Experience': '10+ years', 'Weddings Covered': '500+', 'Team Size': '5 photographers', 'Delivery': '4-6 weeks' }),
            categorySlug: 'photography',
            packages: [
                { name: 'Basic Coverage', price: 'PKR 120,000', description: 'Single photographer for 8 hours', features: JSON.stringify(['1 photographer', '8 hours coverage', '500+ edited photos', 'Online gallery']), isPopular: false, sortOrder: 1 },
                { name: 'Premium Coverage', price: 'PKR 220,000', description: 'Full team with video', features: JSON.stringify(['2 photographers', '1 videographer', 'Full day coverage', '1000+ edited photos', '4K highlight video', 'Drone shots', 'Online gallery']), isPopular: true, sortOrder: 2 },
                { name: 'Luxury Package', price: 'PKR 350,000', description: 'Complete documentation', features: JSON.stringify(['3 photographers', '2 videographers', 'Pre-wedding shoot', 'Full day coverage', 'Cinematic film', 'Drone shots', 'Printed album', 'Same-day highlights']), isPopular: false, sortOrder: 3 },
            ],
            addons: [
                { name: 'Pre-wedding Shoot', price: 'PKR 40,000', description: 'Romantic pre-wedding photoshoot' },
                { name: 'Printed Album', price: 'PKR 25,000', description: 'Premium 40-page printed album' },
                { name: 'Extra Hours', price: 'PKR 15,000', description: 'Per additional hour of coverage' },
            ],
        },
        {
            name: 'Zafran Catering Services', slug: 'zafran-catering', city: 'Islamabad', location: 'F-7 Markaz, Islamabad',
            address: 'F-7 Markaz, Blue Area, Islamabad', phone: '+923003333333', email: 'orders@zafran.pk',
            about: 'Zafran Catering has been serving the finest Pakistani and continental cuisine for over 15 years. Our expert chefs create memorable dining experiences for weddings of all sizes.',
            description: 'Premium catering services for weddings in Islamabad and Rawalpindi.',
            imageUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80',
            gallery: JSON.stringify(['https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80']),
            features: JSON.stringify(['Pakistani cuisine', 'Continental options', 'Live cooking stations', 'Professional staff', 'Custom menus', 'Halal certified']),
            priceRange: 'PKR 1,500/head', minPrice: 1500, maxPrice: 5000,
            rating: 4.7, totalReviews: 87, isVerified: true, isFeatured: true, respondsQuickly: false,
            workingHours: JSON.stringify({ 'Monday - Sunday': '9:00 AM - 11:00 PM' }),
            details: JSON.stringify({ 'Min. Guests': '200', 'Cuisine': 'Pakistani & Continental', 'Staff': 'Professional waiters', 'Halal': 'Yes' }),
            categorySlug: 'catering',
            packages: [
                { name: 'Standard Menu', price: 'PKR 1,500/head', description: 'Classic Pakistani wedding menu', features: JSON.stringify(['5 main dishes', 'Rice & bread', 'Salads & raita', 'Dessert', 'Drinks']), isPopular: false, sortOrder: 1 },
                { name: 'Premium Menu', price: 'PKR 2,500/head', description: 'Extended menu with live stations', features: JSON.stringify(['8 main dishes', 'Live BBQ station', 'Rice & bread varieties', 'Salad bar', 'Dessert counter', 'Drinks & juices']), isPopular: true, sortOrder: 2 },
            ],
            addons: [
                { name: 'Live BBQ Station', price: 'PKR 50,000', description: 'Live BBQ with dedicated chef' },
                { name: 'Dessert Counter', price: 'PKR 30,000', description: 'Premium dessert display' },
            ],
        },
        {
            name: 'Glam by Sana', slug: 'glam-by-sana', city: 'Karachi', location: 'Clifton, Karachi',
            address: 'Block 5, Clifton, Karachi', phone: '+923004444444', email: 'sana@glambysana.com',
            about: 'Celebrity makeup artist Sana brings 12 years of experience to your wedding day. Specializing in bridal makeup, we create looks that are timeless, elegant, and perfectly suited to your features.',
            description: 'Professional bridal makeup and hair styling in Karachi.',
            imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
            gallery: JSON.stringify(['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80', 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80', 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80']),
            features: JSON.stringify(['Airbrush makeup', 'HD makeup', 'Hair styling', 'Trial session', 'On-location service', 'Mehndi makeup']),
            priceRange: 'PKR 80,000+', minPrice: 80000, maxPrice: 200000,
            rating: 4.8, totalReviews: 112, isVerified: true, isFeatured: true, respondsQuickly: true,
            workingHours: JSON.stringify({ 'Monday - Saturday': '9:00 AM - 7:00 PM', 'Sunday': 'By appointment' }),
            details: JSON.stringify({ 'Experience': '12 years', 'Specialty': 'Bridal makeup', 'Service': 'On-location available', 'Trial': 'Included' }),
            categorySlug: 'makeup',
            packages: [
                { name: 'Bridal Basic', price: 'PKR 80,000', description: 'Bridal makeup and hair for the big day', features: JSON.stringify(['Bridal makeup', 'Hair styling', 'Touch-up kit', 'Trial session']), isPopular: false, sortOrder: 1 },
                { name: 'Bridal Premium', price: 'PKR 150,000', description: 'Full bridal package with family', features: JSON.stringify(['Airbrush bridal makeup', 'Hair styling', '2 family members makeup', 'Trial session', 'Touch-up kit', 'On-location service']), isPopular: true, sortOrder: 2 },
            ],
            addons: [
                { name: 'Mehndi Makeup', price: 'PKR 30,000', description: 'Makeup for mehndi ceremony' },
                { name: 'Family Makeup', price: 'PKR 15,000', description: 'Per additional family member' },
            ],
        },
        {
            name: 'Floral Dreams Decor', slug: 'floral-dreams-decor', city: 'Lahore', location: 'Model Town, Lahore',
            address: 'Model Town Extension, Lahore', phone: '+923005555555', email: 'info@floraldreams.pk',
            about: 'Transform your wedding venue into a magical wonderland with Floral Dreams. We specialize in creating breathtaking floral arrangements and complete wedding decor that reflects your personal style.',
            description: 'Wedding decoration and floral arrangements in Lahore.',
            imageUrl: 'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=800&q=80',
            gallery: JSON.stringify(['https://images.unsplash.com/photo-1478146059778-26028b07395a?w=800&q=80', 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80', 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80']),
            features: JSON.stringify(['Fresh flowers', 'Artificial flowers', 'Stage decoration', 'Table centerpieces', 'Entrance arch', 'Fairy lights']),
            priceRange: 'PKR 150,000+', minPrice: 150000, maxPrice: 500000,
            rating: 4.8, totalReviews: 76, isVerified: true, isFeatured: true, respondsQuickly: false,
            workingHours: JSON.stringify({ 'Monday - Saturday': '10:00 AM - 8:00 PM' }),
            details: JSON.stringify({ 'Specialty': 'Floral & Stage decor', 'Setup Time': '1 day before', 'Style': 'Traditional & Modern' }),
            categorySlug: 'decor',
            packages: [
                { name: 'Basic Decor', price: 'PKR 150,000', description: 'Essential wedding decoration', features: JSON.stringify(['Stage decoration', 'Entrance flowers', 'Table centerpieces (10 tables)', 'Fairy lights']), isPopular: false, sortOrder: 1 },
                { name: 'Premium Decor', price: 'PKR 300,000', description: 'Full venue transformation', features: JSON.stringify(['Grand stage with floral backdrop', 'Floral entrance arch', 'Table centerpieces (20 tables)', 'Ceiling draping', 'Fairy lights throughout', 'Bridal car decoration']), isPopular: true, sortOrder: 2 },
            ],
            addons: [
                { name: 'Bridal Car Decor', price: 'PKR 15,000', description: 'Beautiful car decoration' },
                { name: 'Extra Tables', price: 'PKR 5,000', description: 'Per additional table centerpiece' },
            ],
        },
        {
            name: 'Melody Strings Band', slug: 'melody-strings-band', city: 'Islamabad', location: 'F-6, Islamabad',
            address: 'Super Market, F-6, Islamabad', phone: '+923006666666', email: 'book@melodystrings.pk',
            about: 'Melody Strings is Islamabad\'s premier wedding entertainment band. With a repertoire spanning classical Pakistani music, Bollywood hits, and modern pop, we create the perfect musical atmosphere for your celebration.',
            description: 'Live music and entertainment for weddings in Islamabad.',
            imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80',
            gallery: JSON.stringify(['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80', 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80']),
            features: JSON.stringify(['Live band', 'DJ services', 'Sound system', 'Lighting', 'Qawwali', 'Bollywood hits']),
            priceRange: 'PKR 90,000+', minPrice: 90000, maxPrice: 250000,
            rating: 4.6, totalReviews: 65, isVerified: false, isFeatured: false, respondsQuickly: true,
            workingHours: JSON.stringify({ 'Monday - Sunday': 'Available for events' }),
            details: JSON.stringify({ 'Band Size': '6-8 members', 'Performance': '4-6 hours', 'Equipment': 'Full sound system included' }),
            categorySlug: 'entertainment',
            packages: [
                { name: 'Standard Show', price: 'PKR 90,000', description: '4-hour live performance', features: JSON.stringify(['6-piece band', '4 hours performance', 'Sound system', 'Basic lighting']), isPopular: false, sortOrder: 1 },
                { name: 'Premium Show', price: 'PKR 180,000', description: '6-hour full entertainment', features: JSON.stringify(['8-piece band', '6 hours performance', 'Professional sound system', 'Stage lighting', 'DJ after band', 'Qawwali set']), isPopular: true, sortOrder: 2 },
            ],
            addons: [
                { name: 'Qawwali Set', price: 'PKR 30,000', description: '1-hour qawwali performance' },
                { name: 'DJ Extension', price: 'PKR 20,000', description: 'Extra 2 hours DJ' },
            ],
        },
    ]

    for (const v of vendorData) {
        const { packages, addons, categorySlug, ...vendorFields } = v
        const category = categories.find(c => c.slug === categorySlug)!

        const vendor = await prisma.vendor.upsert({
            where: { slug: vendorFields.slug },
            update: {},
            create: vendorFields,
        })

        // Link category
        await prisma.vendorCategory.upsert({
            where: { vendorId_categoryId: { vendorId: vendor.id, categoryId: category.id } },
            update: {},
            create: { vendorId: vendor.id, categoryId: category.id },
        })

        // Packages
        for (const pkg of packages) {
            const existing = await prisma.package.findFirst({ where: { vendorId: vendor.id, name: pkg.name } })
            if (!existing) {
                await prisma.package.create({ data: { ...pkg, vendorId: vendor.id } })
            }
        }

        // Addons
        for (const addon of addons) {
            const existing = await prisma.addon.findFirst({ where: { vendorId: vendor.id, name: addon.name } })
            if (!existing) {
                await prisma.addon.create({ data: { ...addon, vendorId: vendor.id } })
            }
        }
    }

    console.log(`✅ ${vendorData.length} vendors seeded`)
    console.log('\n🎉 Seed complete!')
    console.log('   Admin login: phone=+923001234567, password=admin123')
}

main()
    .catch(e => { console.error(e); process.exit(1) })
    .finally(() => prisma.$disconnect())
