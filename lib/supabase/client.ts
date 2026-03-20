/**
 * lib/supabase/client.ts
 * Browser-safe Supabase client — uses only NEXT_PUBLIC keys.
 * Safe to import from 'use client' components.
 */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

