import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/auth'

// GET /api/admin/categories - All categories with tree structure
export const GET = withAuth(async () => {
    const categories = await prisma.category.findMany({
        orderBy: { sortOrder: 'asc' },
        include: {
            _count: { select: { vendors: true, children: true } },
            parent: { select: { id: true, name: true } },
        },
    })
    return NextResponse.json({ success: true, data: categories })
}, ['ADMIN', 'SUPER_ADMIN'])

// POST /api/admin/categories - Create category
export const POST = withAuth(async (request: NextRequest) => {
    try {
        const body = await request.json()
        const { name, slug, description, icon, imageUrl, sortOrder = 0, isActive = true, parentId } = body

        if (!name || !slug) {
            return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 })
        }

        const existing = await prisma.category.findFirst({ where: { OR: [{ slug }, { name }] } })
        if (existing) {
            return NextResponse.json({ error: 'A category with this name or slug already exists' }, { status: 409 })
        }

        const cat = await prisma.category.create({
            data: { name, slug, description, icon, imageUrl, sortOrder, isActive, parentId: parentId || null },
        })
        return NextResponse.json({ success: true, data: cat }, { status: 201 })
    } catch (error) {
        console.error('Create category error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}, ['ADMIN', 'SUPER_ADMIN'])
