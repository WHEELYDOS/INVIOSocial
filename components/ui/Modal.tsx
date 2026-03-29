"use client";

/**
 * components/ui/Modal.tsx
 * Reusable glassmorphism modal with Framer Motion fade+scale animation.
 * Supports ESC key close, click-outside close, and body scroll lock.
 */

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  /** Max width class, defaults to max-w-lg */
  maxWidth?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "max-w-lg",
}: ModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on ESC key
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKey);
    }
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, handleKey]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-md"
            onClick={onClose}
            aria-hidden="true"
          >
            {/* Cinematic radial glow behind the modal */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[800px] h-[800px] bg-accent/10 rounded-full blur-[120px] pointer-events-none animate-pulse duration-[4000ms]" />
            </div>
          </motion.div>

          {/* Modal Panel */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              key="modal-panel"
              initial={{ opacity: 0, scale: 0.93, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className={`relative w-full ${maxWidth} pointer-events-auto`}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              {/* Glass panel */}
              <div
                className="relative rounded-2xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(25,25,35,0.95) 0%, rgba(15,15,25,0.98) 100%)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                }}
              >
                {/* Decorative accent glow top-left */}
                <div className="absolute -top-20 -left-20 w-56 h-56 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

                {/* Header */}
                <div className="relative flex items-start justify-between p-6 pb-0">
                  <div>
                    <h2
                      id="modal-title"
                      className="text-xl font-bold text-white tracking-tight"
                    >
                      {title}
                    </h2>
                    {subtitle && (
                      <p className="mt-1 text-sm text-white/50">{subtitle}</p>
                    )}
                  </div>
                  <button
                    onClick={onClose}
                    className="ml-4 mt-0.5 p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Divider */}
                <div className="mx-6 mt-4 h-px bg-white/[0.06]" />

                {/* Content */}
                <div className="relative p-6 pt-5 max-h-[80vh] overflow-y-auto">
                  {children}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
