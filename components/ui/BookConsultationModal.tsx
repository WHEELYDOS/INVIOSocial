"use client";

/**
 * components/ui/BookConsultationModal.tsx
 * Modal wrapper for the Book Consultation form.
 */

import Modal from "@/components/ui/Modal";
import BookConsultationForm from "@/components/forms/BookConsultationForm";

interface BookConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookConsultationModal({
  isOpen,
  onClose,
}: BookConsultationModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Book a Free Consultation"
      subtitle="We'll get back to you within 24 hours."
      maxWidth="max-w-md"
    >
      <BookConsultationForm onSuccess={undefined} />
    </Modal>
  );
}
