import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/auth'

type Ctx = { params: Promise<{ id: string }> }

export const PATCH = withAuth(async (request: NextRequest, ctx: Ctx) => {
    try {
        const { id } = await ctx.params
        const body = await request.json()

        const data: Record<string, unknown> = {}
        const fields = ['name', 'slug', 'description', 'icon', 'imageUrl', 'sortOrder', 'isActive', 'parentId']
        for (const f of fields) {
            if (body[f] !== undefined) data[f] = body[f]
        }

        // Prevent circular parent
        if (data.parentId === id) {
            return NextResponse.json({ error: 'Category cannot be its own parent' }, { status: 400 })
        }

        const updated = await prisma.category.update({ where: { id }, data })
        return NextResponse.json({ success: true, data: updated })
    } catch (error) {
        console.error('Update category error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}, ['ADMIN', 'SUPER_ADMIN'])

export const DELETE = withAuth(async (_request: NextRequest, ctx: Ctx) => {
    try {
        const { id } = await ctx.params

        // Check for children
        const childCount = await prisma.category.count({ where: { parentId: id } })
        if (childCount > 0) {
            return NextResponse.json({ error: `Cannot delete: ${childCount} subcategories exist. Delete them first.` }, { status: 400 })
        }

        await prisma.category.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete category error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}, ['ADMIN', 'SUPER_ADMIN'])
