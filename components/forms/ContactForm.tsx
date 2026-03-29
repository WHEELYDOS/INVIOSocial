"use client";

/**
 * components/forms/ContactForm.tsx
 * Full contact/audit request form — calls submitContact server action.
 * Supports pre-filling the subject (e.g. "Free Website Audit") from parent.
 */

import { useState, useTransition } from "react";
import { submitContact, type ContactFormData } from "@/actions/contact";
import { Loader2, CheckCircle, AlertCircle, User, Mail, MessageSquare, Tag } from "lucide-react";

// Premium High-end Input base
const inputBase =
  "w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:bg-white/10 focus:border-accent/50 focus:ring-4 focus:ring-accent/10 transition-all duration-300";

// Premium animated label
const labelBase = "block text-[11px] font-semibold text-white/50 mb-2 uppercase tracking-widest group-focus-within:text-accent transition-colors duration-300";

export default function ContactForm({
  defaultSubject = "",
  onSuccess,
}: {
  defaultSubject?: string;
  onSuccess?: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [form, setForm] = useState<ContactFormData>({
    full_name: "",
    email: "",
    subject: defaultSubject,
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});

  function validate(): boolean {
    const newErrors: Partial<Record<keyof ContactFormData, string>> = {};
    if (!form.full_name.trim() || form.full_name.trim().length < 2) {
      newErrors.full_name = "Full name must be at least 2 characters";
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (form.subject && form.subject.trim().length > 0 && form.subject.trim().length < 3) {
      newErrors.subject = "Subject must be at least 3 characters";
    }
    if (!form.message.trim() || form.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    startTransition(async () => {
      const result = await submitContact(form);
      setStatus(result.success ? "success" : "error");
      setStatusMessage(result.message);

      if (result.success) {
        setForm({ full_name: "", email: "", subject: defaultSubject, message: "" });
        onSuccess?.();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Full Name + Email side by side on md+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="group">
          <label htmlFor="cf-full_name" className={labelBase}>
            Full Name <span className="text-accent">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-accent transition-colors duration-300 pointer-events-none" />
            <input
              id="cf-full_name"
              name="full_name"
              type="text"
              autoComplete="name"
              placeholder="Jane Smith"
              value={form.full_name}
              onChange={handleChange}
              disabled={isPending}
              className={`${inputBase} ${errors.full_name ? "border-red-500/60 focus:border-red-500/60 focus:ring-red-500/10" : ""}`}
            />
          </div>
          {errors.full_name && (
            <p className="mt-2 text-[11px] font-medium text-red-400 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" />{errors.full_name}</p>
          )}
        </div>

        <div className="group">
          <label htmlFor="cf-email" className={labelBase}>
            Email <span className="text-accent">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-accent transition-colors duration-300 pointer-events-none" />
            <input
              id="cf-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="jane@example.com"
              value={form.email}
              onChange={handleChange}
              disabled={isPending}
              className={`${inputBase} ${errors.email ? "border-red-500/60 focus:border-red-500/60 focus:ring-red-500/10" : ""}`}
            />
          </div>
          {errors.email && (
            <p className="mt-2 text-[11px] font-medium text-red-400 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" />{errors.email}</p>
          )}
        </div>
      </div>

      {/* Subject */}
      <div className="group">
        <label htmlFor="cf-subject" className={labelBase}>
          Subject{" "}
          <span className="text-white/30 normal-case font-normal">(optional)</span>
        </label>
        <div className="relative">
          <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-accent transition-colors duration-300 pointer-events-none" />
          <input
            id="cf-subject"
            name="subject"
            type="text"
            placeholder="e.g. Free Website Audit"
            value={form.subject}
            onChange={handleChange}
            disabled={isPending}
            className={`${inputBase} ${errors.subject ? "border-red-500/60 focus:border-red-500/60 focus:ring-red-500/10" : ""}`}
          />
        </div>
        {errors.subject && (
          <p className="mt-2 text-[11px] font-medium text-red-400 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" />{errors.subject}</p>
        )}
      </div>

      {/* Message */}
      <div className="group">
        <label htmlFor="cf-message" className={labelBase}>
          Message <span className="text-accent">*</span>
        </label>
        <div className="relative">
          <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-white/30 group-focus-within:text-accent transition-colors duration-300 pointer-events-none" />
          <textarea
            id="cf-message"
            name="message"
            rows={4}
            placeholder="Tell us about your business, goals, or questions..."
            value={form.message}
            onChange={handleChange}
            disabled={isPending}
            className={`${inputBase} resize-none ${errors.message ? "border-red-500/60 focus:border-red-500/60 focus:ring-red-500/10" : ""}`}
          />
        </div>
        {errors.message && (
          <p className="mt-2 text-[11px] font-medium text-red-400 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" />{errors.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending || status === "success"}
        className="w-full relative group overflow-hidden flex items-center justify-center gap-2.5 px-6 py-4 bg-accent hover:bg-accent/90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold tracking-wide rounded-xl transition-all duration-300 text-sm shadow-[0_0_20px_rgba(14,121,178,0.2)] hover:shadow-[0_0_30px_rgba(14,121,178,0.4)] active:scale-[0.98]"
      >
        {/* Button hover gradient sweep */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
        
        {isPending ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin relative z-10" />
            <span className="relative z-10">Sending…</span>
          </>
        ) : status === "success" ? (
          <>
            <CheckCircle className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Message Sent Seamlessly</span>
          </>
        ) : (
          <span className="relative z-10 flex items-center gap-2">Initiate Conversation <span className="group-hover:translate-x-1 transition-transform">→</span></span>
        )}
      </button>

      {/* Status Banner */}
      {status !== "idle" && statusMessage && (
        <div
          className={`flex items-start gap-3 px-5 py-4 rounded-xl text-sm font-medium border ${
            status === "success"
              ? "bg-green-500/10 border-green-500/20 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.1)]"
              : "bg-red-500/10 border-red-500/20 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
          }`}
        >
          {status === "success" ? (
            <CheckCircle className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          {statusMessage}
        </div>
      )}
    </form>
  );
}

