"use client";

/**
 * components/forms/NewsletterSignup.tsx
 * Inline footer email capture — calls subscribeNewsletter server action.
 * Handles duplicates gracefully with a friendly message.
 */

import { useState, useTransition } from "react";
import { subscribeNewsletter } from "@/actions/newsletter";
import { Mail, Loader2, CheckCircle } from "lucide-react";

export default function NewsletterSignup() {
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [touched, setTouched] = useState(false);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const showError = touched && email && !isValidEmail;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);

    if (!email.trim() || !isValidEmail) return;

    startTransition(async () => {
      const result = await subscribeNewsletter(email.trim());
      setStatus(result.success ? "success" : "error");
      setMessage(result.message);

      if (result.success) {
        setEmail("");
        setTouched(false);
      }
    });
  }

  // Reset to allow re-try after an error
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
    if (status === "error") {
      setStatus("idle");
      setMessage("");
    }
  }

  return (
    <div className="w-full">
      {status === "success" ? (
        /* ── Success State ── */
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-accent/15 border border-accent/25 text-accent text-sm">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      ) : (
        /* ── Form State ── */
        <form onSubmit={handleSubmit} noValidate>
          <div className="flex gap-0">
            <input
              type="email"
              value={email}
              onChange={handleChange}
              onBlur={() => setTouched(true)}
              placeholder="Enter your email"
              disabled={isPending}
              aria-label="Newsletter email address"
              className={`flex-1 px-4 py-2.5 bg-white/5 text-white placeholder-white/30 text-sm rounded-l-lg border focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/40 transition-all duration-200 disabled:opacity-60 ${
                showError
                  ? "border-red-500/50"
                  : "border-white/10"
              }`}
            />
            <button
              type="submit"
              disabled={isPending}
              aria-label="Subscribe to newsletter"
              className="px-4 py-2.5 bg-accent hover:bg-accent/90 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-r-lg transition-colors duration-200 flex items-center justify-center shadow-md hover:shadow-accent/30 active:scale-95"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Mail className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Inline validation error */}
          {showError && (
            <p className="mt-1.5 text-xs text-red-400">
              Please enter a valid email address
            </p>
          )}

          {/* Server error */}
          {status === "error" && message && (
            <p className="mt-1.5 text-xs text-red-400">{message}</p>
          )}
        </form>
      )}
    </div>
  );
}
