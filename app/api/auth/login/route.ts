import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { phone, email, password } = body

        if (!password || (!phone && !email)) {
            return NextResponse.json(
                { success: false, error: 'Phone or email and password are required' },
                { status: 400 }
            )
        }

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    phone ? { phone } : undefined,
                    email ? { email } : undefined,
                ].filter(Boolean) as { phone?: string; email?: string }[],
            },
        })

        if (!user) {
            return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 })
        }

        if (!user.isActive) {
            return NextResponse.json({ success: false, error: 'Account is deactivated' }, { status: 403 })
        }

        const isValidPassword = await bcrypt.compare(password, user.password || '')
        if (!isValidPassword) {
            return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 })
        }

        await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } })

        const token = generateToken({
            id: user.id,
            email: user.email,
            phone: user.phone,
            name: user.name,
            role: user.role,
        })

        const { password: _, ...userWithoutPassword } = user

        return NextResponse.json({
            success: true,
            message: 'Login successful',
            data: { user: userWithoutPassword, token },
        })
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}
