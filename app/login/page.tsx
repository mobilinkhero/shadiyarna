'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Suspense } from 'react'

function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirect = searchParams.get('redirect') || '/home'

    const [step, setStep] = useState<'phone' | 'otp'>('phone')
    const [phone, setPhone] = useState('')
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [resendSeconds, setResendSeconds] = useState(0)
    const [devOtp, setDevOtp] = useState('')

    async function sendOtp(e: React.FormEvent) {
        e.preventDefault()
        if (!phone || phone.length < 10) { setError('Enter a valid 10-digit number'); return }
        setLoading(true); setError('')
        try {
            const res = await fetch('/api/auth/otp/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: `+92${phone}` }),
            })
            const json = await res.json()
            if (!res.ok) throw new Error(json.error)
            if (json.otp) setDevOtp(json.otp) // dev only
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
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus()
        }
        if (newOtp.every(d => d) && newOtp.join('').length === 6) {
            setTimeout(verifyOtp, 100)
        }
    }

    function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus()
        }
    }

    const maskedPhone = phone ? `+92 ${phone.slice(0, 3)}*****${phone.slice(-2)}` : ''

    return (
        <div className="flex min-h-screen items-center justify-center bg-white px-6">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="mb-10 text-center">
                    <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#B8860B]">
                        <span className="text-3xl font-bold italic text-[#B8860B]">S</span>
                    </div>
                    <p className="text-lg font-bold italic text-[#B8860B]">Shadiyarana</p>
                </div>

                {step === 'phone' ? (
                    <form onSubmit={sendOtp}>
                        <h1 className="mb-2 text-2xl font-bold text-gray-900">Login or Register</h1>
                        <p className="mb-8 text-sm text-gray-500">Enter your Pakistani mobile number to continue</p>

                        <label className="mb-2 block text-sm font-semibold text-gray-800">Mobile Number</label>
                        <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-gray-50 focus-within:border-[#B8860B]">
                            <div className="flex items-center gap-2 border-r border-gray-200 px-3 py-3">
                                <span className="text-lg">🇵🇰</span>
                                <span className="text-sm font-semibold text-gray-700">+92</span>
                            </div>
                            <input
                                type="tel"
                                value={phone}
                                onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                placeholder="3XX XXXXXXX"
                                className="flex-1 bg-transparent px-3 py-3 text-base tracking-wider outline-none"
                            />
                        </div>
                        <p className="mt-1.5 text-xs text-gray-400">e.g. 03001234567 → enter 3001234567</p>

                        {error && <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

                        <button type="submit" disabled={loading}
                            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-base font-semibold text-white disabled:opacity-60"
                            style={{ backgroundColor: '#B8860B' }}>
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Send OTP'}
                        </button>

                        <p className="mt-6 text-center text-xs text-gray-400">
                            By continuing, you agree to our{' '}
                            <span className="text-[#B8860B]">Terms of Service</span> and{' '}
                            <span className="text-[#B8860B]">Privacy Policy</span>
                        </p>
                    </form>
                ) : (
                    <div>
                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF8EE] mx-auto">
                            <span className="text-3xl">📱</span>
                        </div>
                        <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">Verify OTP</h1>
                        <p className="mb-8 text-center text-sm text-gray-500">
                            We sent a 6-digit code to<br />{maskedPhone}
                        </p>

                        {devOtp && (
                            <div className="mb-4 rounded-xl bg-blue-50 px-3 py-2 text-center text-sm text-blue-700">
                                Dev OTP: <strong>{devOtp}</strong>
                            </div>
                        )}

                        <div className="flex justify-between gap-2">
                            {otp.map((digit, i) => (
                                <input
                                    key={i}
                                    id={`otp-${i}`}
                                    type="tel"
                                    maxLength={1}
                                    value={digit}
                                    onChange={e => handleOtpChange(i, e.target.value)}
                                    onKeyDown={e => handleOtpKeyDown(i, e)}
                                    className="h-14 w-12 rounded-xl border border-gray-200 bg-gray-50 text-center text-xl font-bold text-gray-900 focus:border-[#B8860B] focus:outline-none"
                                />
                            ))}
                        </div>

                        {error && <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

                        <button onClick={verifyOtp} disabled={loading || otp.join('').length < 6}
                            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-base font-semibold text-white disabled:opacity-60"
                            style={{ backgroundColor: '#B8860B' }}>
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Verify & Continue'}
                        </button>

                        <div className="mt-4 text-center text-sm">
                            {resendSeconds > 0 ? (
                                <span className="text-gray-500">Resend code in <span className="font-semibold text-[#B8860B]">{resendSeconds}s</span></span>
                            ) : (
                                <button onClick={() => { setStep('phone'); setOtp(['', '', '', '', '', '']) }} className="text-[#B8860B] font-semibold underline">
                                    Resend OTP
                                </button>
                            )}
                        </div>
                        <div className="mt-2 text-center text-sm">
                            <button onClick={() => setStep('phone')} className="text-gray-500">
                                Wrong number? <span className="font-semibold text-[#B8860B]">Change</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense>
            <LoginForm />
        </Suspense>
    )
}
