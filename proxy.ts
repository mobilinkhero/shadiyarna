import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

/**
 * Protects /admin routes — redirects to /login if no valid admin token is present.
 * The token is read from the Authorization header OR a cookie named `token`.
 */
export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    if (pathname.startsWith('/admin')) {
        // Allow the login page itself through
        if (pathname === '/admin/login') return NextResponse.next()

        // Try cookie first (browser navigation), then Authorization header (API clients)
        const cookieToken = request.cookies.get('token')?.value
        const headerToken = request.headers.get('authorization')?.split(' ')[1]
        const rawToken = cookieToken || headerToken

        if (!rawToken) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }

        const user = verifyToken(
            new NextRequest(request.url, {
                headers: { authorization: `Bearer ${rawToken}` },
            })
        )

        if (!user || !['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*'],
}
