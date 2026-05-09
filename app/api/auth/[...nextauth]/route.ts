import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                phone: { label: 'Phone', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.password) {
                    throw new Error('Password is required')
                }

                // Find user by email or phone
                const user = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { email: credentials.email || undefined },
                            { phone: credentials.phone || undefined }
                        ]
                    }
                })

                if (!user) {
                    throw new Error('No user found')
                }

                if (!user.password) {
                    throw new Error('User has no password set')
                }

                // Verify password
                const isValid = await bcrypt.compare(credentials.password, user.password)

                if (!isValid) {
                    throw new Error('Invalid password')
                }

                if (!user.isActive) {
                    throw new Error('Account is deactivated')
                }

                // Update last login
                await prisma.user.update({
                    where: { id: user.id },
                    data: { lastLogin: new Date() }
                })

                return {
                    id: user.id,
                    email: user.email,
                    phone: user.phone,
                    name: user.name,
                    role: user.role,
                    image: user.avatar
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.phone = (user as any).phone
                token.role = (user as any).role
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id as string
                    ; (session.user as any).phone = token.phone as string
                    ; (session.user as any).role = token.role as string
            }
            return session
        }
    },
    pages: {
        signIn: '/login',
        error: '/auth/error'
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development'
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }