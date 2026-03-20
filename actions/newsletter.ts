/**
 * actions/newsletter.ts
 * Server Action: Newsletter subscription from Footer email capture.
 * Validates email, handles duplicates gracefully, inserts to Supabase.
 */
"use server";

import { z } from "zod";
import { supabaseServer } from "@/lib/supabase/server";

// ── Helpers ──────────────────────────────────────────────────────────────────

function sanitize(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim().toLowerCase();
}

// ── Zod Schema ────────────────────────────────────────────────────────────────

const newsletterSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(255, "Email is too long"),
});

// ── Server Action ─────────────────────────────────────────────────────────────

export async function subscribeNewsletter(
  email: string
): Promise<{ success: boolean; message: string }> {
  // 1. Validate email
  const parsed = newsletterSchema.safeParse({ email });
  if (!parsed.success) {
    return { success: false, message: "Please enter a valid email address." };
  }

  const cleanEmail = sanitize(parsed.data.email);

  try {
    // 2. Check for existing active subscriber
    const { data: existing, error: selectError } = await supabaseServer
      .from("newsletter_subscribers")
      .select("id, is_active")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (selectError) {
      console.error("[newsletter] Duplicate check failed:", selectError.code);
      // Fall through and attempt insert
    }

    if (existing) {
      if (existing.is_active) {
        return { success: true, message: "You're already subscribed! 🎉" };
      }

      // Reactivate previously unsubscribed email
      const { error: updateError } = await supabaseServer
        .from("newsletter_subscribers")
        .update({ is_active: true, subscribed_at: new Date().toISOString() })
        .eq("id", existing.id);

      if (updateError) {
        console.error("[newsletter] Reactivation error:", updateError.code);
        return { success: false, message: "Something went wrong. Please try again." };
      }

      return { success: true, message: "Welcome back! You're re-subscribed. 🎉" };
    }

    // 3. Insert new subscriber
    const { error: insertError } = await supabaseServer
      .from("newsletter_subscribers")
      .insert({ email: cleanEmail });

    if (insertError) {
      // Postgres unique constraint violation (duplicate race condition)
      if (insertError.code === "23505") {
        return { success: true, message: "You're already subscribed! 🎉" };
      }
      console.error("[newsletter] Insert error:", insertError.code);
      return { success: false, message: "Something went wrong. Please try again." };
    }

    return { success: true, message: "Welcome aboard! 🎉" };
  } catch {
    console.error("[newsletter] Unexpected error");
    return { success: false, message: "Something went wrong. Please try again." };
  }
}
