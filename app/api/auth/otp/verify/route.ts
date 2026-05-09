import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateToken } from '@/lib/auth'
import { verifyStoredOtp } from '../send/route'

/**
 * POST /api/auth/otp/verify
 * Verifies the OTP and returns a JWT token.
 * If the user doesn't exist yet, creates a new account automatically.
 *
 * Body: { phone: string, otp: string, name?: string }
 * Response: { success: true, data: { user, token, isNewUser } }
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { phone, otp, name } = body

        if (!phone || !otp) {
            return NextResponse.json({ success: false, error: 'phone and otp are required' }, { status: 400 })
        }

        const isValid = verifyStoredOtp(phone, otp)
        if (!isValid) {
            return NextResponse.json({ success: false, error: 'Invalid or expired OTP' }, { status: 401 })
        }

        // Find or create user
        let user = await prisma.user.findUnique({ where: { phone } })
        let isNewUser = false

        if (!user) {
            user = await prisma.user.create({
                data: {
                    phone,
                    name: name || null,
                    role: 'USER',
                    isActive: true,
                },
            })
            isNewUser = true
        } else {
            if (!user.isActive) {
                return NextResponse.json({ success: false, error: 'Account is deactivated' }, { status: 403 })
            }
            await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } })
        }

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
            message: isNewUser ? 'Account created successfully' : 'Login successful',
            data: { user: userWithoutPassword, token, isNewUser },
        })
    } catch (error) {
        console.error('OTP verify error:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}
