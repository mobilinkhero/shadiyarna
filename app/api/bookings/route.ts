import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/auth'

// GET /api/bookings - List bookings for the authenticated user
export const GET = withAuth(async (request: NextRequest, _ctx, user) => {
    try {
        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status') // optional filter
        const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
        const limit = Math.min(50, parseInt(searchParams.get('limit') || '20'))
        const skip = (page - 1) * limit

        const where: Record<string, unknown> = { userId: user.id }
        if (status) where.status = status.toUpperCase()

        const [total, bookings] = await Promise.all([
            prisma.booking.count({ where }),
            prisma.booking.findMany({
                where,
                skip,
                take: limit,
                include: {
                    vendor: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                            imageUrl: true,
                            city: true,
                            phone: true,
                            rating: true,
                        },
                    },
                    package: {
                        select: { id: true, name: true, price: true },
                    },
                    bookingAddons: {
                        include: {
                            addon: { select: { id: true, name: true, price: true } },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
        ])

        return NextResponse.json({
            success: true,
            data: bookings,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        })
    } catch (error) {
        console.error('Error fetching bookings:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
})

// POST /api/bookings - Create a new booking
export const POST = withAuth(async (request: NextRequest, _ctx, user) => {
    try {
        const body = await request.json()
        const { vendorId, packageId, date, time, guests, notes, addonIds = [] } = body

        if (!vendorId || !date) {
            return NextResponse.json({ error: 'vendorId and date are required' }, { status: 400 })
        }

        // Verify vendor exists
        const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } })
        if (!vendor) {
            return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
        }

        // Verify package belongs to vendor (if provided)
        if (packageId) {
            const pkg = await prisma.package.findFirst({ where: { id: packageId, vendorId } })
            if (!pkg) {
                return NextResponse.json({ error: 'Package not found for this vendor' }, { status: 404 })
            }
        }

        const booking = await prisma.booking.create({
            data: {
                userId: user.id,
                vendorId,
                packageId: packageId || null,
                date: new Date(date),
                time: time || null,
                guests: guests ? parseInt(guests) : null,
                notes: notes || null,
                status: 'PENDING',
            },
        })

        // Add addons if provided
        if (addonIds.length > 0) {
            await prisma.bookingAddon.createMany({
                data: addonIds.map((addonId: string) => ({
                    bookingId: booking.id,
                    addonId,
                    quantity: 1,
                })),
            })
        }

        const created = await prisma.booking.findUnique({
            where: { id: booking.id },
            include: {
                vendor: { select: { id: true, name: true, imageUrl: true, city: true, phone: true } },
                package: { select: { id: true, name: true, price: true } },
                bookingAddons: {
                    include: { addon: { select: { id: true, name: true, price: true } } },
                },
            },
        })

        return NextResponse.json({ success: true, message: 'Booking created successfully', data: created }, { status: 201 })
    } catch (error) {
        console.error('Error creating booking:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
})
