-- INVIO Social: Row Level Security Policies
-- Run this AFTER 001_create_tables.sql in Supabase SQL Editor

-- ─────────────────────────────────────────────
-- RLS: consultations
-- ─────────────────────────────────────────────
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

-- Allow anonymous visitors to INSERT (submit the form)
CREATE POLICY "anon_insert_consultations"
  ON public.consultations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Block all public reads/writes — only service role can SELECT/UPDATE/DELETE
CREATE POLICY "block_public_select_consultations"
  ON public.consultations
  FOR SELECT
  TO anon, authenticated
  USING (false);

-- ─────────────────────────────────────────────
-- RLS: newsletter_subscribers
-- ─────────────────────────────────────────────
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_insert_newsletter"
  ON public.newsletter_subscribers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "block_public_select_newsletter"
  ON public.newsletter_subscribers
  FOR SELECT
  TO anon, authenticated
  USING (false);

-- ─────────────────────────────────────────────
-- RLS: contact_submissions
-- ─────────────────────────────────────────────
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_insert_contact"
  ON public.contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "block_public_select_contact"
  ON public.contact_submissions
  FOR SELECT
  TO anon, authenticated
  USING (false);
