import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/auth'

type Ctx = { params: Promise<{ id: string }> }

export const PATCH = withAuth(async (req: NextRequest, ctx: Ctx) => {
    try {
        const { id } = await ctx.params
        const body = await req.json()
        const data: Record<string, unknown> = {}
        for (const f of ['name', 'price', 'description']) if (body[f] !== undefined) data[f] = body[f]
        const updated = await prisma.addon.update({ where: { id }, data })
        return NextResponse.json({ success: true, data: updated })
    } catch (error) {
        console.error('Update addon error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}, ['ADMIN', 'SUPER_ADMIN'])

export const DELETE = withAuth(async (_req: NextRequest, ctx: Ctx) => {
    try {
        const { id } = await ctx.params
        await prisma.addon.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete addon error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}, ['ADMIN', 'SUPER_ADMIN'])
