"use client";

/**
 * components/forms/BookConsultationForm.tsx
 * Consultation booking form — calls bookConsultation server action.
 * Shows loading spinner, success/error messages. Clears on success.
 */

import { useState, useTransition } from "react";
import { bookConsultation, type ConsultationFormData } from "@/actions/consultation";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

const inputBase =
  "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-accent/60 focus:border-accent/40 transition-all duration-200";

const labelBase = "block text-xs font-medium text-white/60 mb-1.5 tracking-wide uppercase";

export default function BookConsultationForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState<ConsultationFormData>({
    full_name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<ConsultationFormData>>({});

  // Basic client-side validation before hitting server
  function validate(): boolean {
    const newErrors: Partial<ConsultationFormData> = {};
    if (!form.full_name.trim() || form.full_name.trim().length < 2) {
      newErrors.full_name = "Full name must be at least 2 characters";
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (form.message && form.message.trim().length > 0 && form.message.trim().length < 10) {
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
    if (errors[name as keyof ConsultationFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    startTransition(async () => {
      const result = await bookConsultation(form);
      setStatus(result.success ? "success" : "error");
      setMessage(result.message);

      if (result.success) {
        setForm({ full_name: "", email: "", phone: "", message: "" });
        onSuccess?.();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Full Name */}
      <div>
        <label htmlFor="bc-full_name" className={labelBase}>
          Full Name <span className="text-accent">*</span>
        </label>
        <input
          id="bc-full_name"
          name="full_name"
          type="text"
          autoComplete="name"
          placeholder="Jane Smith"
          value={form.full_name}
          onChange={handleChange}
          disabled={isPending}
          className={`${inputBase} ${errors.full_name ? "border-red-500/60" : ""}`}
        />
        {errors.full_name && (
          <p className="mt-1.5 text-xs text-red-400">{errors.full_name}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="bc-email" className={labelBase}>
          Email Address <span className="text-accent">*</span>
        </label>
        <input
          id="bc-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="jane@example.com"
          value={form.email}
          onChange={handleChange}
          disabled={isPending}
          className={`${inputBase} ${errors.email ? "border-red-500/60" : ""}`}
        />
        {errors.email && (
          <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>
        )}
      </div>

      {/* Phone (optional) */}
      <div>
        <label htmlFor="bc-phone" className={labelBase}>
          Phone Number{" "}
          <span className="text-white/30 normal-case font-normal">(optional)</span>
        </label>
        <input
          id="bc-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+91 98765 43210"
          value={form.phone}
          onChange={handleChange}
          disabled={isPending}
          className={inputBase}
        />
      </div>

      {/* Message (optional) */}
      <div>
        <label htmlFor="bc-message" className={labelBase}>
          Tell us about your business{" "}
          <span className="text-white/30 normal-case font-normal">(optional)</span>
        </label>
        <textarea
          id="bc-message"
          name="message"
          rows={3}
          placeholder="Brief description of your business and goals..."
          value={form.message}
          onChange={handleChange}
          disabled={isPending}
          className={`${inputBase} resize-none ${errors.message ? "border-red-500/60" : ""}`}
        />
        {errors.message && (
          <p className="mt-1.5 text-xs text-red-400">{errors.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending || status === "success"}
        className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 bg-accent hover:bg-accent/90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 text-sm shadow-lg shadow-accent/20 hover:shadow-accent/30 hover:shadow-xl active:scale-[0.98]"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Submitting…
          </>
        ) : status === "success" ? (
          <>
            <CheckCircle className="w-4 h-4" />
            Submitted!
          </>
        ) : (
          "Book My Consultation →"
        )}
      </button>

      {/* Status Message */}
      {status !== "idle" && message && (
        <div
          className={`flex items-start gap-2.5 px-4 py-3 rounded-xl text-sm ${
            status === "success"
              ? "bg-green-500/10 border border-green-500/20 text-green-400"
              : "bg-red-500/10 border border-red-500/20 text-red-400"
          }`}
        >
          {status === "success" ? (
            <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          )}
          {message}
        </div>
      )}
    </form>
  );
}
