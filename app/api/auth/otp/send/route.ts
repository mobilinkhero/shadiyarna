import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/auth/otp/send
 * Sends an OTP to the given phone number.
 *
 * In development (or when no SMS provider is configured) the OTP is returned
 * in the response so the Flutter app can auto-fill it during testing.
 *
 * In production, integrate a real SMS provider here (e.g. Twilio Verify,
 * Firebase Phone Auth, or any Pakistani SMS gateway like Jazz/Telenor API).
 *
 * Body: { phone: string }
 * Response: { success: true, message: string, otp?: string (dev only) }
 */

// In-memory OTP store — replace with Redis or DB in production
const otpStore = new Map<string, { otp: string; expiresAt: number }>()

export function generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

export function storeOtp(phone: string, otp: string) {
    otpStore.set(phone, {
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    })
}

export function verifyStoredOtp(phone: string, otp: string): boolean {
    const entry = otpStore.get(phone)
    if (!entry) return false
    if (Date.now() > entry.expiresAt) {
        otpStore.delete(phone)
        return false
    }
    if (entry.otp !== otp) return false
    otpStore.delete(phone) // one-time use
    return true
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { phone } = body

        if (!phone) {
            return NextResponse.json({ success: false, error: 'phone is required' }, { status: 400 })
        }

        const otp = generateOtp()
        storeOtp(phone, otp)

        const isDev = process.env.NODE_ENV !== 'production'

        // TODO: In production, send OTP via SMS provider
        // await sendSms(phone, `Your Shadiyarana OTP is: ${otp}`)

        console.log(`[OTP] ${phone} → ${otp}`)

        return NextResponse.json({
            success: true,
            message: 'OTP sent successfully',
            // Only expose OTP in development for easy testing
            ...(isDev ? { otp } : {}),
        })
    } catch (error) {
        console.error('OTP send error:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}
