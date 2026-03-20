"use client";

/**
 * components/ui/ContactModal.tsx
 * Modal wrapper for the Contact / Free Audit form.
 * Accepts an optional defaultSubject to pre-fill the subject field.
 */

import Modal from "@/components/ui/Modal";
import ContactForm from "@/components/forms/ContactForm";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSubject?: string;
}

export default function ContactModal({
  isOpen,
  onClose,
  defaultSubject = "Free Website Audit",
}: ContactModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Get Your Free Audit"
      subtitle="Tell us about your business — we'll analyse your online presence."
      maxWidth="max-w-xl"
    >
      <ContactForm defaultSubject={defaultSubject} onSuccess={undefined} />
    </Modal>
  );
}
