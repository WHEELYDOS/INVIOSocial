/**
 * actions/contact.ts
 * Server Action: Contact / Free Audit form submission.
 * Validates with Zod, sanitizes inputs, inserts to Supabase.
 */
"use server";

import { z } from "zod";
import { supabaseServer } from "@/lib/supabase/server";

// ── Helpers ──────────────────────────────────────────────────────────────────

function sanitize(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim();
}

// ── Zod Schema ────────────────────────────────────────────────────────────────

const contactSchema = z.object({
  full_name: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be at most 100 characters")
    .regex(/^[a-zA-Z\s\-'.]+$/, "Full name contains invalid characters"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(255, "Email is too long"),
  subject: z
    .string()
    .min(3, "Subject must be at least 3 characters")
    .max(150, "Subject must be at most 150 characters")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be at most 1000 characters"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// ── Server Action ─────────────────────────────────────────────────────────────

export async function submitContact(
  formData: ContactFormData
): Promise<{ success: boolean; message: string }> {
  // 1. Validate inputs
  const parsed = contactSchema.safeParse(formData);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input";
    return { success: false, message: firstError };
  }

  const { full_name, email, subject, message } = parsed.data;

  // 2. Sanitize
  const cleanName = sanitize(full_name);
  const cleanEmail = sanitize(email);
  const cleanSubject = subject ? sanitize(subject) : null;
  const cleanMessage = sanitize(message);

  try {
    // 3. Insert into Supabase
    const { error } = await supabaseServer.from("contact_submissions").insert({
      full_name: cleanName,
      email: cleanEmail,
      subject: cleanSubject,
      message: cleanMessage,
    });

    if (error) {
      console.error("[contact] Insert error:", error.code);
      return {
        success: false,
        message: "Something went wrong. Please try again or email us directly.",
      };
    }

    return {
      success: true,
      message: "Thanks for reaching out! We'll respond within 24 hours.",
    };
  } catch {
    console.error("[contact] Unexpected error");
    return { success: false, message: "Something went wrong. Please try again." };
  }
}
