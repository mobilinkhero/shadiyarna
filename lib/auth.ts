import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export interface AuthUser {
    id: string
    email?: string | null
    phone: string
    name?: string | null
    role: string
}

function getJwtSecret(): string {
    const secret = process.env.JWT_SECRET
    if (!secret || secret === 'your-jwt-secret-key-change-in-production') {
        if (process.env.NODE_ENV === 'production') {
            throw new Error('JWT_SECRET env var must be set in production')
        }
        // Dev fallback — warn loudly
        console.warn('[auth] WARNING: JWT_SECRET is not set. Using insecure default.')
        return 'dev-only-insecure-secret'
    }
    return secret
}

export function generateToken(user: AuthUser): string {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            phone: user.phone,
            name: user.name,
            role: user.role,
        },
        getJwtSecret(),
        { expiresIn: '7d' }
    )
}

/**
 * Extracts and verifies the Bearer token from an App Router request.
 * Returns the decoded user or null.
 */
export function verifyToken(request: NextRequest): AuthUser | null {
    try {
        const authHeader = request.headers.get('authorization')
        const token = authHeader?.split(' ')[1]
        if (!token) return null
        return jwt.verify(token, getJwtSecret()) as AuthUser
    } catch {
        return null
    }
}

/**
 * App Router middleware helper — wraps a route handler with auth.
 * Usage:
 *   export const POST = withAuth(async (req, ctx, user) => { ... })
 *   export const PUT  = withAuth(async (req, ctx, user) => { ... }, ['ADMIN'])
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RouteContext = { params: Promise<any> }
type AuthedHandler = (
    req: NextRequest,
    ctx: RouteContext,
    user: AuthUser
) => Promise<NextResponse>

export function withAuth(handler: AuthedHandler, roles?: string[]) {
    return async (req: NextRequest, ctx: RouteContext): Promise<NextResponse> => {
        const user = verifyToken(req)

        if (!user) {
            return NextResponse.json({ error: 'Access token required' }, { status: 401 })
        }

        if (roles && !roles.includes(user.role)) {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
        }

        return handler(req, ctx, user)
    }
}
