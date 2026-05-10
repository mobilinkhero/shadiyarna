'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'

function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirect = searchParams.get('redirect') || '/'

    const [step, setStep] = useState<'phone' | 'otp'>('phone')
    const [phone, setPhone] = useState('')
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [resendSeconds, setResendSeconds] = useState(0)
    const [devOtp, setDevOtp] = useState('')

    async function sendOtp(e: React.FormEvent) {
        e.preventDefault()
        if (!phone || phone.length < 10) { setError('Enter a valid 10-digit number after +92'); return }
        setLoading(true); setError('')
        try {
            const res = await fetch('/api/auth/otp/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: `+92${phone}` }),
            })
            const json = await res.json()
            if (!res.ok) throw new Error(json.error)
            if (json.otp) setDevOtp(json.otp)
            setStep('otp')
            startResendTimer()
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to send OTP')
        } finally { setLoading(false) }
    }

    function startResendTimer() {
        setResendSeconds(60)
        const t = setInterval(() => {
            setResendSeconds(s => { if (s <= 1) { clearInterval(t); return 0 } return s - 1 })
        }, 1000)
    }

    async function verifyOtp() {
        const code = otp.join('')
        if (code.length < 6) return
        setLoading(true); setError('')
        try {
            const res = await fetch('/api/auth/otp/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: `+92${phone}`, otp: code }),
            })
            const json = await res.json()
            if (!res.ok) throw new Error(json.error)
            localStorage.setItem('token', json.data.token)
            localStorage.setItem('user', JSON.stringify(json.data.user))
            router.push(redirect)
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Invalid OTP')
        } finally { setLoading(false) }
    }

    function handleOtpChange(index: number, value: string) {
        if (!/^\d*$/.test(value)) return
        const newOtp = [...otp]
        newOtp[index] = value.slice(-1)
        setOtp(newOtp)
        if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus()
        if (newOtp.every(d => d)) setTimeout(verifyOtp, 100)
    }

    function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus()
        }
    }

    return (
        <div className="flex min-h-screen bg-[#F8F7F4]">
            {/* Left panel — branding */}
            <div className="hidden flex-1 items-center justify-center bg-gradient-to-br from-[#1a0a00] via-[#2d1200] to-[#1a0a00] lg:flex">
                <div className="max-w-sm text-center">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#B8860B] to-[#D4A017] shadow-2xl">
                        <span className="text-4xl font-bold italic text-white">S</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white">Shadiyarana</h1>
                    <p className="mt-3 text-lg text-amber-200/70">Pakistan&apos;s #1 Wedding Planning Platform</p>
                    <div className="mt-10 grid grid-cols-3 gap-4 text-center">
                        {[['2,500+', 'Vendors'], ['10,000+', 'Couples'], ['4.8/5', 'Rating']].map(([v, l]) => (
                            <div key={l} className="rounded-xl bg-white/10 p-3">
                                <p className="text-xl font-bold text-white">{v}</p>
                                <p className="text-xs text-white/60">{l}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right panel — form */}
            <div className="flex flex-1 items-center justify-center px-6 py-12">
                <div className="w-full max-w-sm">
                    {/* Mobile logo */}
                    <div className="mb-8 text-center lg:hidden">
                        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#B8860B] to-[#D4A017]">
                            <span className="text-2xl font-bold italic text-white">S</span>
                        </div>
                        <p className="font-bold text-gray-900">Shadiyarana</p>
                    </div>

                    {step === 'phone' ? (
                        <form onSubmit={sendOtp}>
                            <h2 className="mb-1 text-2xl font-bold text-gray-900">Login or Register</h2>
                            <p className="mb-8 text-sm text-gray-500">Enter your Pakistani mobile number to continue</p>

                            <label className="mb-2 block text-sm font-semibold text-gray-800">Mobile Number</label>
                            <div className="flex overflow-hidden rounded-xl border border-[#EBEBEB] bg-white focus-within:border-[#B8860B] focus-within:ring-2 focus-within:ring-[#B8860B]/10 transition-all">
                                <div className="flex items-center gap-2 border-r border-[#EBEBEB] px-4 py-3.5">
                                    <span className="text-xl">🇵🇰</span>
                                    <span className="text-sm font-semibold text-gray-700">+92</span>
                                </div>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    placeholder="3XX XXXXXXX"
                                    className="flex-1 bg-transparent px-4 py-3.5 text-base tracking-wider text-gray-900 outline-none placeholder-gray-400"
                                    autoFocus
                                />
                            </div>
                            <p className="mt-1.5 text-xs text-gray-400">e.g. 03001234567 → enter 3001234567</p>

                            {error && <p className="mt-3 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>}

                            <button type="submit" disabled={loading}
                                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-base font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
                                style={{ backgroundColor: '#B8860B' }}>
                                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Send OTP'}
                            </button>

                            <p className="mt-6 text-center text-xs text-gray-400">
                                By continuing, you agree to our{' '}
                                <span className="text-[#B8860B] cursor-pointer hover:underline">Terms of Service</span>
                                {' '}and{' '}
                                <span className="text-[#B8860B] cursor-pointer hover:underline">Privacy Policy</span>
                            </p>
                        </form>
                    ) : (
                        <div>
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF8EE] mx-auto">
                                <span className="text-3xl">📱</span>
                            </div>
                            <h2 className="mb-1 text-center text-2xl font-bold text-gray-900">Verify OTP</h2>
                            <p className="mb-8 text-center text-sm text-gray-500">
                                We sent a 6-digit code to +92 {phone.slice(0, 3)}*****{phone.slice(-2)}
                            </p>

                            {devOtp && (
                                <div className="mb-5 rounded-xl bg-blue-50 px-4 py-3 text-center text-sm text-blue-700">
                                    Dev OTP: <strong className="font-mono text-base">{devOtp}</strong>
                                </div>
                            )}

                            <div className="flex justify-between gap-2">
                                {otp.map((digit, i) => (
                                    <input key={i} id={`otp-${i}`} type="tel" maxLength={1} value={digit}
                                        onChange={e => handleOtpChange(i, e.target.value)}
                                        onKeyDown={e => handleOtpKeyDown(i, e)}
                                        className="h-14 w-12 rounded-xl border border-[#EBEBEB] bg-white text-center text-xl font-bold text-gray-900 focus:border-[#B8860B] focus:outline-none focus:ring-2 focus:ring-[#B8860B]/10 transition-all"
                                    />
                                ))}
                            </div>

                            {error && <p className="mt-3 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>}

                            <button onClick={verifyOtp} disabled={loading || otp.join('').length < 6}
                                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-base font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
                                style={{ backgroundColor: '#B8860B' }}>
                                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Verify & Continue'}
                            </button>

                            <div className="mt-5 space-y-2 text-center text-sm">
                                {resendSeconds > 0 ? (
                                    <p className="text-gray-500">Resend code in <span className="font-semibold text-[#B8860B]">{resendSeconds}s</span></p>
                                ) : (
                                    <button onClick={() => { setStep('phone'); setOtp(['', '', '', '', '', '']); setDevOtp('') }}
                                        className="font-semibold text-[#B8860B] hover:underline">
                                        Resend OTP
                                    </button>
                                )}
                                <p>
                                    <button onClick={() => setStep('phone')} className="text-gray-500 hover:text-gray-700">
                                        Wrong number? <span className="font-semibold text-[#B8860B]">Change</span>
                                    </button>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return <Suspense><LoginForm /></Suspense>
}
