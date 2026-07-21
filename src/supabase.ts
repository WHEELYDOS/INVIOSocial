/**
 * src/supabase.ts
 * Supabase browser client + typed insert helpers for lead capture.
 *
 * Uses the anon key (safe for browser — RLS only allows INSERT).
 * Credentials from the original INVIO Social project.
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ctflhihpyxtdacjwqojm.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0ZmxoaWhweXh0ZGFjandxb2ptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5ODk4NDcsImV4cCI6MjA4OTU2NTg0N30.NBfrDpuKklQuwGuuIm1Z9PU8jX7MmxXxWa5r-z6lvcE'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

/* ── Helpers ──────────────────────────────────────────────────────── */

/** Strip HTML tags and trim whitespace */
function sanitize(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim()
}

/* ── Types ────────────────────────────────────────────────────────── */

export interface ConsultationFormData {
  full_name: string
  email: string
  phone?: string
  message?: string
}

export interface ActionResult {
  success: boolean
  message: string
}

/* ── Book Consultation ────────────────────────────────────────────── */

export async function bookConsultation(
  data: ConsultationFormData,
): Promise<ActionResult> {
  // Validate
  if (!data.full_name.trim() || data.full_name.trim().length < 2) {
    return { success: false, message: 'Full name must be at least 2 characters.' }
  }
  if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return { success: false, message: 'Please enter a valid email address.' }
  }

  const cleanName = sanitize(data.full_name)
  const cleanEmail = sanitize(data.email)
  const cleanPhone = data.phone ? sanitize(data.phone) : null
  const cleanMessage = data.message ? sanitize(data.message) : null

  const { error } = await supabase.from('consultations').insert({
    full_name: cleanName,
    email: cleanEmail,
    phone: cleanPhone,
    message: cleanMessage,
    status: 'pending',
  })

  if (error) {
    console.error('[consultation] Insert error:', error.code, error.message)
    return {
      success: false,
      message: 'Something went wrong. Please try again or email us directly.',
    }
  }

  return { success: true, message: "We'll be in touch within 24 hours!" }
}

/* ── Newsletter Subscribe ─────────────────────────────────────────── */

export async function subscribeNewsletter(email: string): Promise<ActionResult> {
  if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, message: 'Please enter a valid email address.' }
  }

  const cleanEmail = sanitize(email).toLowerCase()

  const { error } = await supabase
    .from('newsletter_subscribers')
    .insert({ email: cleanEmail })

  if (error) {
    // Postgres unique constraint violation — already subscribed
    if (error.code === '23505') {
      return { success: true, message: "You're already subscribed!" }
    }
    console.error('[newsletter] Insert error:', error.code, error.message)
    return { success: false, message: 'Something went wrong. Please try again.' }
  }

  return { success: true, message: 'Welcome aboard!' }
}
