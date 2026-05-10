import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/auth'

export const POST = withAuth(async (req: NextRequest) => {
    try {
        const body = await req.json()
        const { vendorId, name, price, description } = body
        if (!vendorId || !name || !price) {
            return NextResponse.json({ error: 'vendorId, name and price are required' }, { status: 400 })
        }
        const addon = await prisma.addon.create({
            data: { vendorId, name, price, description: description || null },
        })
        return NextResponse.json({ success: true, data: addon }, { status: 201 })
    } catch (error) {
        console.error('Create addon error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}, ['ADMIN', 'SUPER_ADMIN'])
