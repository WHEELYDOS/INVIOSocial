"use client";

/**
 * components/forms/NewsletterSignup.tsx
 * Inline footer email capture — calls subscribeNewsletter server action.
 * Handles duplicates gracefully with a premium pill UI.
 */

import { useState, useTransition } from "react";
import { subscribeNewsletter } from "@/actions/newsletter";
import { Mail, Loader2, CheckCircle, ArrowRight } from "lucide-react";

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
        <div className="flex items-center gap-3 px-5 py-3.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm shadow-[0_0_20px_rgba(34,197,94,0.1)] transition-all">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span className="font-medium tracking-wide">{message}</span>
        </div>
      ) : (
        /* ── Form State ── */
        <form onSubmit={handleSubmit} noValidate className="relative group">
          {/* Subtle animated background glow behind the input */}
          <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          <div 
            className={`relative flex items-center p-1.5 rounded-full bg-white/5 border backdrop-blur-md transition-all duration-300 ${
              showError
                ? "border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                : "border-white/10 group-focus-within:border-accent/40 group-focus-within:bg-white/10 group-focus-within:shadow-[0_0_20px_rgba(14,121,178,0.1)]"
            }`}
          >
            <Mail className="w-5 h-5 text-white/30 ml-3 mr-2 group-focus-within:text-accent transition-colors duration-300" />
            <input
              type="email"
              value={email}
              onChange={handleChange}
              onBlur={() => setTouched(true)}
              placeholder="Enter your email"
              disabled={isPending}
              aria-label="Newsletter email address"
              className="flex-1 bg-transparent text-white placeholder-white/30 text-sm focus:outline-none disabled:opacity-60 px-2 py-2"
            />
            <button
              type="submit"
              disabled={isPending}
              aria-label="Subscribe to newsletter"
              className="px-5 py-2.5 bg-accent hover:bg-accent/90 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-full transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg hover:shadow-accent/30 active:scale-95 group/btn overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin relative z-10" />
              ) : (
                <span className="relative z-10 font-semibold text-sm flex items-center gap-1.5">
                  Join <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </div>

          {/* Validation & Server errors */}
          <div className="absolute -bottom-6 left-4">
            {showError && (
              <p className="text-[11px] font-medium text-red-400">
                Please enter a valid email address
              </p>
            )}
            {status === "error" && message && (
              <p className="text-[11px] font-medium text-red-400">{message}</p>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
