/**
 * src/BookingModal.tsx
 * Strategy Session & "Make a Project" booking modal:
 * 2-column dark-mode layout precisely matching the reference mockup:
 * - Left column: Branded logo, chalk doodles, "Let's build your loop." with crown & cyan underline,
 *   and custom 3D isometric desk illustration (laptop + checklist + coffee mug + sticky note).
 * - Right column: "FREE CONSULTATION" badge with radiating sparks, "NO STRINGS. JUST IDEAS.",
 *   "Book a Strategy Session", styled icon inputs, "LET'S MAKE IT HAPPEN" doodle,
 *   vibrant coral CTA button with sparks, and 3-perk feature row.
 * - Retains full Supabase backend integration (`bookConsultation`).
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { bookConsultation, type ConsultationFormData, type ActionResult } from '@/supabase'
import ModalIllustration from '@/ModalIllustration'

/* ── Clean SVG Icon Helpers ───────────────────────────────────────── */

function UserIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function MailIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function PhoneIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function MessageIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function CalendarIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function RupeeIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M8.5 7.5h7M8.5 10.5h5M8.5 7.5v3a2.5 2.5 0 0 0 2.5 2.5H12M11 13l4 4.5" />
    </svg>
  )
}

function ShieldCheckIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

function CloseIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function CheckIcon({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

/* ── Main Booking Modal Component ─────────────────────────────────── */

export default function BookingModal({
  open,
  onClose,
  defaultService,
}: {
  open: boolean
  onClose: () => void
  defaultService?: string
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

  /* ── Prefill message when defaultService changes ── */
  useEffect(() => {
    if (open && defaultService) {
      setForm((prev) => ({
        ...prev,
        message: `I'm interested in ${defaultService}. Here's what we need: `,
      }))
    }
  }, [open, defaultService])

  /* ── Close with exit animation ── */
  const handleClose = useCallback(() => {
    setClosing(true)
    setTimeout(() => {
      setClosing(false)
      setResult(null)
      setFieldErrors({})
      onClose()
    }, 250)
  }, [onClose])

  /* ── ESC key to close ── */
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, handleClose])

  /* ── Lock body scroll when modal is active ── */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open && !closing) return null

  /* ── Client-side validation ── */
  function validate(): boolean {
    const errs: typeof fieldErrors = {}
    if (!form.full_name.trim() || form.full_name.trim().length < 2) {
      errs.full_name = 'Please enter your full name'
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Please enter a valid email address'
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
      setTimeout(() => handleClose(), 2800)
    }
  }

  const isClosing = closing
  const isSuccess = result?.success

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 md:p-8">
      {/* Dimmed Dark Backdrop */}
      <div
        ref={backdropRef}
        className={`absolute inset-0 bg-[#060911]/80 backdrop-blur-md transition-opacity duration-250 ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleClose}
      />

      {/* Main Modal Container */}
      <div
        className={`relative z-10 w-full max-w-[960px] max-h-[92vh] overflow-y-auto rounded-[24px] sm:rounded-[28px] border border-[#1e293b]/90 bg-[#0a0f19] shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_50px_rgba(56,189,248,0.05)] transition-all duration-300 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top subtle blue rim light */}
        <div className="pointer-events-none absolute left-0 top-0 h-[1.5px] w-full bg-gradient-to-r from-transparent via-sky-400/30 to-transparent" />

        {/* Close Button (X) */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 sm:right-6 sm:top-6 z-30 flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-all hover:text-white hover:bg-white/10"
          aria-label="Close modal"
        >
          <CloseIcon />
        </button>

        {isSuccess ? (
          /* ── SUCCESS STATE ── */
          <div className="flex flex-col items-center justify-center py-20 px-8 text-center modal-success-enter">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-green-500/30 bg-green-500/10 text-green-400 shadow-[0_0_35px_rgba(34,197,94,0.25)]">
              <CheckIcon />
            </div>
            <h3 className="font-display text-3xl font-bold text-white">
              Strategy Session Booked!
            </h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-300">
              {result?.message || "Thanks for reaching out! We've received your request and will follow up shortly to schedule your call."}
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-slate-400">
              <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              Closing automatically…
            </div>
          </div>
        ) : (
          /* ── TWO-COLUMN MODAL CONTENT ── */
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.05fr] divide-y md:divide-y-0 md:divide-x divide-[#1e293b]/70">
            {/* ══════════════════════════════════════════════════════
                LEFT COLUMN: Branding, Headline & Desk Illustration
               ══════════════════════════════════════════════════════ */}
            <div className="relative flex flex-col justify-between p-6 sm:p-8 lg:p-10">
              <div>
                {/* Header Row: INVIO SOCIAL logo + IDEAS AUTOMATION GROWTH doodle */}
                <div className="flex items-start justify-between gap-4">
                  {/* Logo */}
                  <div className="flex flex-col select-none">
                    <span className="font-display text-[15px] font-black tracking-tight text-white leading-none">
                      INVIO
                    </span>
                    <span className="font-display text-[11px] font-extrabold tracking-[0.2em] text-white/90 leading-tight mt-0.5">
                      SOCIAL
                    </span>
                  </div>

                  {/* Top-Right Hand-Drawn Doodle */}
                  <div className="flex items-center gap-1.5 select-none pr-1">
                    <div className="font-hand font-bold text-[14.5px] leading-[1.1] text-slate-300 tracking-wide text-right">
                      <div>IDEAS</div>
                      <div>AUTOMATION</div>
                      <div>GROWTH</div>
                    </div>
                    {/* Curved hand-drawn downward arrow */}
                    <svg
                      width="20"
                      height="30"
                      viewBox="0 0 22 34"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-slate-300 shrink-0"
                    >
                      <path d="M12 2 C 19 10, 18 20, 4 28" />
                      <path d="M3 22 L 4 28 L 10 27" />
                    </svg>
                  </div>
                </div>

                {/* Bold Headline */}
                <div className="mt-7 sm:mt-9">
                  <h2 className="font-display text-[34px] sm:text-[40px] font-black tracking-tight text-white leading-[1.08]">
                    <div>Let's</div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span>build your</span>
                      {/* Cyan crown doodle */}
                      <svg
                        width="30"
                        height="24"
                        viewBox="0 0 30 24"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="inline-block translate-y-[-2px]"
                      >
                        <path d="M3 20 L5 7 L12 14 L15 4 L18 14 L25 7 L27 20 Z" />
                        <line x1="3" y1="20" x2="27" y2="20" strokeWidth="2.5" />
                      </svg>
                    </div>
                    <div className="relative inline-block text-sky-400">
                      loop.
                      {/* Cyan hand-drawn double brush underline */}
                      <svg
                        className="absolute -bottom-2.5 left-0 w-[115%] h-3 overflow-visible pointer-events-none"
                        viewBox="0 0 120 12"
                        fill="none"
                      >
                        <path d="M2 6 C 35 2, 85 3, 118 6" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
                        <path d="M14 9 C 45 6, 75 6, 106 9" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                  </h2>

                  {/* Subtitle description */}
                  <p className="mt-4 text-[13.5px] leading-relaxed text-slate-400 max-w-sm">
                    Tell us about your business and we'll map out the automation opportunities — free, no strings.
                  </p>
                </div>
              </div>

              {/* Desk Illustration with Isometric Laptop, Coffee Mug & Post-It Note */}
              <div className="mt-6 pt-2">
                <ModalIllustration />
              </div>
            </div>

            {/* ══════════════════════════════════════════════════════
                RIGHT COLUMN: Strategy Session Booking Form
               ══════════════════════════════════════════════════════ */}
            <div className="relative p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
              <div>
                {/* Top Badge: ⚡ FREE CONSULTATION + NO STRINGS. JUST IDEAS. */}
                <div className="flex items-center gap-3 select-none flex-wrap pr-10">
                  {/* Badge Pill with 3 radiating sparks */}
                  <div className="relative inline-flex items-center">
                    {/* Radiating 3 cyan sparks */}
                    <div className="absolute -top-3.5 right-6 pointer-events-none select-none">
                      <svg width="22" height="13" viewBox="0 0 24 14" fill="none" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round">
                        <line x1="4" y1="12" x2="2" y2="4" />
                        <line x1="12" y1="12" x2="12" y2="2" />
                        <line x1="20" y1="12" x2="22" y2="4" />
                      </svg>
                    </div>

                    <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/80 bg-slate-900/90 px-3.5 py-1.5 shadow-inner">
                      <svg className="h-3.5 w-3.5 text-rose-500 fill-rose-500 shrink-0" viewBox="0 0 24 24">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                      </svg>
                      <span className="text-[11px] font-black tracking-wider uppercase text-white">
                        FREE CONSULTATION
                      </span>
                    </div>
                  </div>

                  {/* Chalk text: NO STRINGS. JUST IDEAS. */}
                  <div className="flex items-center gap-1.5">
                    <svg
                      width="20"
                      height="14"
                      viewBox="0 0 22 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-slate-300"
                    >
                      <path d="M18 4 C 12 4, 6 6, 2 12" />
                      <path d="M2 7 L 2 12 L 7 12" />
                    </svg>
                    <div className="font-hand font-bold text-[13.5px] leading-[1.1] text-slate-300">
                      <div>NO STRINGS.</div>
                      <div>JUST IDEAS.</div>
                    </div>
                  </div>
                </div>

                {/* Heading: Book a Strategy Session */}
                <h2 className="mt-4 font-display text-[26px] sm:text-[28px] font-black tracking-tight text-white">
                  Book a <span className="text-sky-400">Strategy Session</span>
                </h2>

                {/* Form with Right Gutter for the Doodle */}
                <div className="relative mt-5">
                  {/* Hand-drawn "LET'S MAKE IT HAPPEN" doodle positioned on the right of Phone */}
                  <div className="absolute right-0 top-[116px] select-none pointer-events-none hidden sm:flex flex-col items-center translate-x-2 z-10">
                    <div className="font-hand font-bold text-[13.5px] leading-tight text-slate-300 text-center rotate-[5deg]">
                      <div>LET'S</div>
                      <div>MAKE IT</div>
                      <div>HAPPEN</div>
                    </div>
                    <svg
                      width="22"
                      height="32"
                      viewBox="0 0 24 36"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-slate-300 mt-0.5"
                    >
                      <path d="M14 2 C 20 12, 18 24, 6 32" />
                      <path d="M5 25 L 6 32 L 13 31" />
                    </svg>
                  </div>

                  <form onSubmit={handleSubmit} noValidate className="space-y-3.5 sm:space-y-4 sm:pr-14">
                    {/* Field: Full Name */}
                    <div>
                      <label htmlFor="modal-fullname" className="block text-[12px] font-semibold text-slate-300 mb-1">
                        Full Name <span className="text-slate-400">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                          <UserIcon className="w-4 h-4" />
                        </div>
                        <input
                          id="modal-fullname"
                          name="full_name"
                          type="text"
                          autoComplete="name"
                          placeholder="Your full name"
                          value={form.full_name}
                          onChange={handleChange}
                          disabled={submitting}
                          className={`w-full rounded-xl border bg-[#111724] py-2.5 pl-10 pr-3.5 text-sm text-white placeholder-slate-500 transition-colors focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400 ${
                            fieldErrors.full_name ? 'border-red-500/60' : 'border-[#1e293b]'
                          }`}
                        />
                      </div>
                      {fieldErrors.full_name && (
                        <p className="mt-1 text-[11px] text-red-400 font-medium">{fieldErrors.full_name}</p>
                      )}
                    </div>

                    {/* Field: Email Address */}
                    <div>
                      <label htmlFor="modal-email" className="block text-[12px] font-semibold text-slate-300 mb-1">
                        Email Address <span className="text-slate-400">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                          <MailIcon className="w-4 h-4" />
                        </div>
                        <input
                          id="modal-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          placeholder="you@company.com"
                          value={form.email}
                          onChange={handleChange}
                          disabled={submitting}
                          className={`w-full rounded-xl border bg-[#111724] py-2.5 pl-10 pr-3.5 text-sm text-white placeholder-slate-500 transition-colors focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400 ${
                            fieldErrors.email ? 'border-red-500/60' : 'border-[#1e293b]'
                          }`}
                        />
                      </div>
                      {fieldErrors.email && (
                        <p className="mt-1 text-[11px] text-red-400 font-medium">{fieldErrors.email}</p>
                      )}
                    </div>

                    {/* Field: Phone (optional) */}
                    <div>
                      <label htmlFor="modal-phone" className="block text-[12px] font-semibold text-slate-300 mb-1">
                        Phone <span className="text-slate-400 font-normal">(optional)</span>
                      </label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                          <PhoneIcon className="w-4 h-4" />
                        </div>
                        <input
                          id="modal-phone"
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          placeholder="+91 98765 43210"
                          value={form.phone}
                          onChange={handleChange}
                          disabled={submitting}
                          className="w-full rounded-xl border border-[#1e293b] bg-[#111724] py-2.5 pl-10 pr-3.5 text-sm text-white placeholder-slate-500 transition-colors focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                        />
                      </div>
                    </div>

                    {/* Field: Tell us about your business (optional) */}
                    <div>
                      <label htmlFor="modal-message" className="block text-[12px] font-semibold text-slate-300 mb-1">
                        Tell us about your business <span className="text-slate-400 font-normal">(optional)</span>
                      </label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none">
                          <MessageIcon className="w-4 h-4" />
                        </div>
                        <textarea
                          id="modal-message"
                          name="message"
                          rows={3}
                          placeholder="What do you do? Any specific goals?"
                          value={form.message}
                          onChange={handleChange}
                          disabled={submitting}
                          className="w-full resize-none rounded-xl border border-[#1e293b] bg-[#111724] py-2.5 pl-10 pr-3.5 text-sm text-white placeholder-slate-500 transition-colors focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                        />
                      </div>
                    </div>

                    {/* Submit Button with Red/Coral Chalk Doodle Sparks */}
                    <div className="pt-2 relative flex items-center justify-center">
                      {/* Left Sparks */}
                      <svg
                        width="16"
                        height="24"
                        viewBox="0 0 16 24"
                        fill="none"
                        stroke="#f43f5e"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        className="absolute -left-5 select-none pointer-events-none"
                      >
                        <line x1="14" y1="6" x2="3" y2="2" />
                        <line x1="14" y1="18" x2="3" y2="22" />
                      </svg>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full rounded-xl bg-[#f43f5e] py-3 px-6 font-display text-[15px] font-bold text-white shadow-[0_4px_20px_rgba(244,63,94,0.35)] transition-all duration-200 hover:bg-[#ff2448] hover:shadow-[0_6px_28px_rgba(244,63,94,0.45)] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {submitting ? (
                          <span className="flex items-center gap-2">
                            <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Booking Session…
                          </span>
                        ) : (
                          <span>Book My Free Consultation &rarr;</span>
                        )}
                      </button>

                      {/* Right Sparks */}
                      <svg
                        width="16"
                        height="24"
                        viewBox="0 0 16 24"
                        fill="none"
                        stroke="#f43f5e"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        className="absolute -right-5 select-none pointer-events-none"
                      >
                        <line x1="2" y1="6" x2="13" y2="2" />
                        <line x1="2" y1="18" x2="13" y2="22" />
                      </svg>
                    </div>

                    {/* Backend Error Alert */}
                    {result && !result.success && (
                      <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs font-medium text-red-400">
                        {result.message}
                      </div>
                    )}
                  </form>
                </div>
              </div>

              {/* ── Perks Row at Bottom ── */}
              <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-[12px] text-slate-300 font-medium select-none">
                <div className="flex items-center gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span>30 minutes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RupeeIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span>Completely free</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheckIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span>No commitment</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
