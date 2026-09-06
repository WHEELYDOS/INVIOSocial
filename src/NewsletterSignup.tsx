/**
 * src/NewsletterSignup.tsx
 * Inline footer newsletter email capture — inserts into Supabase `newsletter_subscribers`.
 */

import { useState } from 'react'
import { subscribeNewsletter, type ActionResult } from '@/supabase'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<ActionResult | null>(null)
  const [touched, setTouched] = useState(false)

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const showError = touched && email.length > 0 && !isValidEmail

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setTouched(true)

    if (!email.trim() || !isValidEmail) return

    setSubmitting(true)
    const res = await subscribeNewsletter(email.trim())
    setSubmitting(false)
    setResult(res)

    if (res.success) {
      setEmail('')
      setTouched(false)
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value)
    if (result?.success === false) {
      setResult(null)
    }
  }

  if (result?.success) {
    return (
      <div className="flex items-center gap-2.5 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2.5 text-sm text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.08)] transition-all">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3" />
        </svg>
        <span className="font-medium">{result.message}</span>
      </div>
    )
  }

  return (
    <div className="w-full max-w-xs">
      <form onSubmit={handleSubmit} noValidate className="group relative">
        {/* Glow on focus */}
        <div className="pointer-events-none absolute inset-0 rounded-full bg-steel/15 blur-xl opacity-0 transition-opacity duration-500 group-focus-within:opacity-100" />

        <div
          className={`relative flex items-center rounded-full border p-1 backdrop-blur-md transition-all duration-300 ${
            showError
              ? 'border-red-500/40 bg-white/[0.03]'
              : 'border-white/10 bg-white/[0.03] group-focus-within:border-steel/40 group-focus-within:bg-white/[0.06]'
          }`}
        >
          {/* Mail icon */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            className="ml-3.5 mr-1 shrink-0 text-frosted/30 transition-colors duration-300 group-focus-within:text-steel"
          >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6" />
          </svg>

          <input
            id="newsletter-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={handleChange}
            onBlur={() => setTouched(true)}
            placeholder="your@email.com"
            disabled={submitting}
            aria-label="Newsletter email address"
            className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-honeydew placeholder-frosted/30 focus:outline-none disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={submitting}
            aria-label="Subscribe to newsletter"
            className="group/btn relative flex items-center gap-1.5 overflow-hidden rounded-full bg-steel px-4 py-2 text-xs font-semibold text-honeydew shadow-md transition-all duration-300 hover:bg-steel/90 hover:shadow-lg hover:shadow-steel/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Hover sweep */}
            <div className="pointer-events-none absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover/btn:translate-x-[100%]" />

            {submitting ? (
              <svg className="relative z-10 h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <span className="relative z-10 flex items-center gap-1">
                Join
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" className="transition-transform duration-300 group-hover/btn:translate-x-0.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            )}
          </button>
        </div>

        {/* Error messages */}
        {(showError || (result && !result.success)) && (
          <p className="mt-2 pl-4 text-[11px] font-medium text-red-400">
            {showError ? 'Please enter a valid email address' : result?.message}
          </p>
        )}
      </form>
    </div>
  )
}
