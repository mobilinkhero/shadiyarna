import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/auth'

// GET /api/categories - List all active categories (public)
export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
            include: {
                _count: { select: { vendors: true } },
            },
        })

        const data = categories.map((c) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            description: c.description,
            icon: c.icon,
            imageUrl: c.imageUrl,
            sortOrder: c.sortOrder,
            vendorCount: c._count.vendors,
        }))

        return NextResponse.json({ success: true, data })
    } catch (error) {
        console.error('Error fetching categories:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST /api/categories - Create category (ADMIN only)
export const POST = withAuth(async (request: NextRequest) => {
    try {
        const body = await request.json()
        const { name, slug, description, icon, imageUrl, sortOrder = 0 } = body

        if (!name || !slug) {
            return NextResponse.json({ error: 'name and slug are required' }, { status: 400 })
        }

        const existing = await prisma.category.findFirst({
            where: { OR: [{ name }, { slug }] },
        })
        if (existing) {
            return NextResponse.json({ error: 'Category with this name or slug already exists' }, { status: 409 })
        }

        const category = await prisma.category.create({
            data: { name, slug, description, icon, imageUrl, sortOrder, isActive: true },
        })

        return NextResponse.json({ success: true, data: category }, { status: 201 })
    } catch (error) {
        console.error('Error creating category:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}, ['ADMIN', 'SUPER_ADMIN'])
