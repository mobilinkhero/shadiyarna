import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, email, phone, password } = body

        if (!phone || !password) {
            return NextResponse.json(
                { success: false, error: 'Phone and password are required' },
                { status: 400 }
            )
        }

        // Validate phone format (basic)
        const phoneRegex = /^\+?[0-9]{10,15}$/
        if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
            return NextResponse.json({ success: false, error: 'Invalid phone number format' }, { status: 400 })
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { phone },
                    email ? { email } : undefined,
                ].filter(Boolean) as { phone?: string; email?: string }[],
            },
        })

        if (existingUser) {
            return NextResponse.json(
                { success: false, error: 'User with this phone or email already exists' },
                { status: 409 }
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                name: name || null,
                email: email || null,
                phone,
                password: hashedPassword,
                role: 'USER',
                isActive: true,
            },
        })

        const token = generateToken({
            id: user.id,
            email: user.email,
            phone: user.phone,
            name: user.name,
            role: user.role,
        })

        const { password: _, ...userWithoutPassword } = user

        return NextResponse.json(
            {
                success: true,
                message: 'User registered successfully',
                data: { user: userWithoutPassword, token },
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}
