/**
 * actions/consultation.ts
 * Server Action: Book Consultation form submission.
 * Validates with Zod, rate-limits per email (max 3 in 24h), inserts to Supabase.
 */
"use server";

import { z } from "zod";
import { supabaseServer } from "@/lib/supabase/server";

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Strip HTML tags and trim whitespace from user input */
function sanitize(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim();
}

// ── Zod Schema ────────────────────────────────────────────────────────────────

const consultationSchema = z.object({
  full_name: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be at most 100 characters")
    .regex(/^[a-zA-Z\s\-'.]+$/, "Full name contains invalid characters"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(255, "Email is too long"),
  phone: z
    .string()
    .max(30, "Phone number is too long")
    .regex(/^[\+\d\s\-\(\)]*$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be at most 1000 characters")
    .optional()
    .or(z.literal("")),
});

export type ConsultationFormData = z.infer<typeof consultationSchema>;

// ── Server Action ─────────────────────────────────────────────────────────────

export async function bookConsultation(
  formData: ConsultationFormData
): Promise<{ success: boolean; message: string }> {
  // 1. Validate inputs with Zod
  const parsed = consultationSchema.safeParse(formData);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input";
    return { success: false, message: firstError };
  }

  const { full_name, email, phone, message } = parsed.data;

  // 2. Sanitize all text fields
  const cleanName = sanitize(full_name);
  const cleanEmail = sanitize(email);
  const cleanPhone = phone ? sanitize(phone) : null;
  const cleanMessage = message ? sanitize(message) : null;

  try {
    // 3. Rate limiting: block if same email submitted 3+ times in past 24 hours
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { count, error: countError } = await supabaseServer
      .from("consultations")
      .select("id", { count: "exact", head: true })
      .eq("email", cleanEmail)
      .gte("created_at", cutoff);

    if (countError) {
      // Rate limit check failed — fail safe, allow the request through
      console.error("[consultation] Rate limit check failed");
    } else if (count !== null && count >= 3) {
      return {
        success: false,
        message:
          "You've submitted too many requests today. Please try again tomorrow or email us directly at inviosocial@gmail.com.",
      };
    }

    // 4. Insert into Supabase
    const { error } = await supabaseServer.from("consultations").insert({
      full_name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      message: cleanMessage,
      status: "pending",
    });

    if (error) {
      // Never expose raw DB errors to the frontend
      console.error("[consultation] Insert error:", error.code);
      return {
        success: false,
        message: "Something went wrong. Please try again or email us directly.",
      };
    }

    return {
      success: true,
      message: "We'll be in touch within 24 hours! 🎉",
    };
  } catch {
    console.error("[consultation] Unexpected error");
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
