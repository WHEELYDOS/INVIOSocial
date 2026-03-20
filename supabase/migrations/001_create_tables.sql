-- INVIO Social: Lead Capture Tables
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/ctflhihpyxtdacjwqojm/sql/new

-- Enable UUID extension (usually already enabled)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─────────────────────────────────────────────
-- Table: consultations
-- Stores Book Consultation form submissions
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.consultations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name   TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  message     TEXT,
  status      TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'contacted', 'completed')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS consultations_email_idx ON public.consultations (email);
CREATE INDEX IF NOT EXISTS consultations_created_at_idx ON public.consultations (created_at DESC);

-- ─────────────────────────────────────────────
-- Table: newsletter_subscribers
-- Stores footer newsletter email captures
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email          TEXT UNIQUE NOT NULL,
  subscribed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active      BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS newsletter_email_idx ON public.newsletter_subscribers (email);

-- ─────────────────────────────────────────────
-- Table: contact_submissions
-- Stores Contact / Free Audit form submissions
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name   TEXT NOT NULL,
  email       TEXT NOT NULL,
  subject     TEXT,
  message     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS contact_email_idx ON public.contact_submissions (email);
CREATE INDEX IF NOT EXISTS contact_created_at_idx ON public.contact_submissions (created_at DESC);
