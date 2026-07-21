/**
 * src/BookingModal.tsx
 * Premium glassmorphic booking modal — inserts into Supabase `consultations` table.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { bookConsultation, type ConsultationFormData, type ActionResult } from '@/supabase'

/* ── SVG icon paths ─────────────────────────────────────────────── */
const ICON_USER = 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z'
const ICON_MAIL = 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6'
const ICON_PHONE = 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z'
const ICON_MSG = 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z'
const ICON_CHECK = 'M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3'
const ICON_ALERT = 'M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z'
const ICON_X = 'M18 6L6 18M6 6l12 12'
const ICON_SPARKLE = 'M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z'

function SvgIcon({ d, size = 20, className = '' }: { d: string; size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d={d} />
    </svg>
  )
}

/* ── Main Modal ─────────────────────────────────────────────────── */

export default function BookingModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const backdropRef = useRef<HTMLDivElement>(null)
  const [closing, setClosing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<ActionResult | null>(null)
  const [form, setForm] = useState<ConsultationFormData>({
    full_name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ConsultationFormData, string>>>({})

  /* ── Close with exit animation ── */
  const handleClose = useCallback(() => {
    setClosing(true)
    setTimeout(() => {
      setClosing(false)
      setResult(null)
      setFieldErrors({})
      onClose()
    }, 280)
  }, [onClose])

  /* ── ESC to close ── */
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, handleClose])

  /* ── Lock body scroll ── */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open && !closing) return null

  /* ── Client-side validation ── */
  function validate(): boolean {
    const errs: typeof fieldErrors = {}
    if (!form.full_name.trim() || form.full_name.trim().length < 2) {
      errs.full_name = 'Full name must be at least 2 characters'
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Please enter a valid email address'
    }
    if (form.message && form.message.trim().length > 0 && form.message.trim().length < 10) {
      errs.message = 'Message must be at least 10 characters'
    }
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (fieldErrors[name as keyof ConsultationFormData]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    const res = await bookConsultation(form)
    setSubmitting(false)
    setResult(res)

    if (res.success) {
      setForm({ full_name: '', email: '', phone: '', message: '' })
      // Auto-close after success
      setTimeout(() => handleClose(), 2500)
    }
  }

  const isClosing = closing
  const isSuccess = result?.success

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className={`absolute inset-0 bg-ink/80 backdrop-blur-md ${isClosing ? 'modal-backdrop-exit' : 'modal-backdrop-enter'}`}
        onClick={handleClose}
      />

      {/* Modal panel */}
      <div
        className={`modal-panel relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/[0.08] bg-panel/95 shadow-[0_32px_64px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-xl ${isClosing ? 'modal-exit' : 'modal-enter'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent line */}
        <div className="absolute left-0 top-0 h-[2px] w-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />

        {/* Glow orb */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-white/5 blur-[80px]" aria-hidden />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-white/5 blur-[60px]" aria-hidden />

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-frosted/60 transition-all duration-200 hover:border-strawberry/40 hover:bg-white/5 hover:text-honeydew"
          aria-label="Close modal"
        >
          <SvgIcon d={ICON_X} size={16} />
        </button>

        <div className="relative p-8 sm:p-10">
          {isSuccess ? (
            /* ── Success State ── */
            <div className="flex flex-col items-center py-8 text-center modal-success-enter">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-green-500/20 bg-green-500/10 text-green-400 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
                <SvgIcon d={ICON_CHECK} size={36} />
              </div>
              <h3 className="font-display text-2xl font-bold text-honeydew">
                You're booked!
              </h3>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-frosted/60">
                {result?.message}
              </p>
              <div className="mt-6 flex items-center gap-2 text-xs text-frosted/40">
                <SvgIcon d={ICON_SPARKLE} size={14} className="text-strawberry/60" />
                Closing automatically…
              </div>
            </div>
          ) : (
            /* ── Form State ── */
            <>
              {/* Header */}
              <div className="mb-8">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-medium tracking-wide text-honeydew">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)] animate-pulse" />
                  Free consultation
                </div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-honeydew sm:text-3xl">
                  Let's build your loop
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-frosted/50">
                  Tell us about your business and we'll map out the automation opportunities — free, no strings.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Full Name */}
                <div className="group">
                  <label htmlFor="bm-name" className="modal-label">
                    Full Name <span className="text-white/40">*</span>
                  </label>
                  <div className="relative">
                    <SvgIcon d={ICON_USER} size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-frosted/30 transition-colors duration-300 group-focus-within:text-steel pointer-events-none" />
                    <input
                      id="bm-name"
                      name="full_name"
                      type="text"
                      autoComplete="name"
                      placeholder="Jane Smith"
                      value={form.full_name}
                      onChange={handleChange}
                      disabled={submitting}
                      className={`modal-input pl-11 ${fieldErrors.full_name ? 'border-red-500/50 focus:border-red-500/50' : ''}`}
                    />
                  </div>
                  {fieldErrors.full_name && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-medium text-red-400">
                      <SvgIcon d={ICON_ALERT} size={12} /> {fieldErrors.full_name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="group">
                  <label htmlFor="bm-email" className="modal-label">
                    Email Address <span className="text-white/40">*</span>
                  </label>
                  <div className="relative">
                    <SvgIcon d={ICON_MAIL} size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-frosted/30 transition-colors duration-300 group-focus-within:text-steel pointer-events-none" />
                    <input
                      id="bm-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="jane@example.com"
                      value={form.email}
                      onChange={handleChange}
                      disabled={submitting}
                      className={`modal-input pl-11 ${fieldErrors.email ? 'border-red-500/50 focus:border-red-500/50' : ''}`}
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-medium text-red-400">
                      <SvgIcon d={ICON_ALERT} size={12} /> {fieldErrors.email}
                    </p>
                  )}
                </div>

                {/* Phone (optional) */}
                <div className="group">
                  <label htmlFor="bm-phone" className="modal-label">
                    Phone <span className="text-frosted/30 normal-case font-normal tracking-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <SvgIcon d={ICON_PHONE} size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-frosted/30 transition-colors duration-300 group-focus-within:text-steel pointer-events-none" />
                    <input
                      id="bm-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+1 (555) 000-0000"
                      value={form.phone}
                      onChange={handleChange}
                      disabled={submitting}
                      className="modal-input pl-11"
                    />
                  </div>
                </div>

                {/* Message (optional) */}
                <div className="group">
                  <label htmlFor="bm-message" className="modal-label">
                    Tell us about your business <span className="text-frosted/30 normal-case font-normal tracking-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <SvgIcon d={ICON_MSG} size={18} className="absolute left-4 top-4 text-frosted/30 transition-colors duration-300 group-focus-within:text-steel pointer-events-none" />
                    <textarea
                      id="bm-message"
                      name="message"
                      rows={3}
                      placeholder="Brief description of your business and goals..."
                      value={form.message}
                      onChange={handleChange}
                      disabled={submitting}
                      className={`modal-input resize-none pl-11 ${fieldErrors.message ? 'border-red-500/50 focus:border-red-500/50' : ''}`}
                    />
                  </div>
                  {fieldErrors.message && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-medium text-red-400">
                      <SvgIcon d={ICON_ALERT} size={12} /> {fieldErrors.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="group relative mt-4 flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-white px-6 py-4 font-display text-sm font-semibold tracking-wide text-space shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all duration-300 hover:bg-white/90 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {/* Hover sweep */}
                  <div className="pointer-events-none absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-space/5 to-transparent transition-transform duration-700 group-hover:translate-x-[100%]" />

                  {submitting ? (
                    <span className="relative z-10 flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Submitting…
                    </span>
                  ) : (
                    <span className="relative z-10 flex items-center gap-2">
                      Book My Consultation
                      <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                    </span>
                  )}
                </button>

                {/* Server error */}
                {result && !result.success && (
                  <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm font-medium text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                    <SvgIcon d={ICON_ALERT} size={18} className="shrink-0 mt-0.5" />
                    {result.message}
                  </div>
                )}
              </form>

              <p className="mt-6 text-center text-[11px] text-frosted/30">
                Free strategy session · No commitment · 30 minutes
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
