import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/auth'
import bcrypt from 'bcryptjs'

type Ctx = { params: Promise<{ id: string }> }

export const GET = withAuth(async (_req: NextRequest, ctx: Ctx) => {
    const { id } = await ctx.params
    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            _count: { select: { bookings: true, reviews: true, wishlists: true } },
        },
    })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    const { password: _p, ...safe } = user
    return NextResponse.json({ success: true, data: safe })
}, ['ADMIN', 'SUPER_ADMIN'])

export const PATCH = withAuth(async (req: NextRequest, ctx: Ctx) => {
    try {
        const { id } = await ctx.params
        const body = await req.json()

        const data: Record<string, unknown> = {}
        const fields = ['name', 'email', 'phone', 'avatar', 'role', 'isActive']
        for (const f of fields) {
            if (body[f] !== undefined) data[f] = body[f]
        }

        if (body.password) {
            data.password = await bcrypt.hash(body.password, 10)
        }

        const updated = await prisma.user.update({ where: { id }, data })
        const { password: _p, ...safe } = updated
        return NextResponse.json({ success: true, data: safe })
    } catch (error) {
        console.error('Update user error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}, ['ADMIN', 'SUPER_ADMIN'])

export const DELETE = withAuth(async (_req: NextRequest, ctx: Ctx) => {
    try {
        const { id } = await ctx.params
        await prisma.user.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete user error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}, ['SUPER_ADMIN'])
