import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/auth'

type Ctx = { params: Promise<{ id: string }> }

export const PATCH = withAuth(async (req: NextRequest, ctx: Ctx) => {
    try {
        const { id } = await ctx.params
        const body = await req.json()

        const data: Record<string, unknown> = {}
        const fields = ['name', 'price', 'originalPrice', 'description', 'isPopular', 'sortOrder']
        for (const f of fields) {
            if (body[f] !== undefined) data[f] = body[f]
        }
        if (body.features !== undefined) data.features = JSON.stringify(body.features)

        const updated = await prisma.package.update({ where: { id }, data })
        return NextResponse.json({ success: true, data: updated })
    } catch (error) {
        console.error('Update package error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}, ['ADMIN', 'SUPER_ADMIN'])

export const DELETE = withAuth(async (_req: NextRequest, ctx: Ctx) => {
    try {
        const { id } = await ctx.params
        await prisma.package.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete package error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}, ['ADMIN', 'SUPER_ADMIN'])
