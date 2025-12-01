"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface SealedScrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookTitle?: string;
}

export function SealedScrollModal({
  isOpen,
  onClose,
  bookTitle,
}: SealedScrollModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="relative max-w-2xl w-full p-12 rounded-lg border"
              style={{
                background:
                  "linear-gradient(135deg, rgba(49, 42, 29, 0.95) 0%, rgba(10, 10, 10, 0.98) 100%)",
                borderColor: "#312A1D",
                boxShadow:
                  "0 20px 60px rgba(0,0,0,0.8), inset 0 1px 0 rgba(200, 182, 141, 0.1)",
              }}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-[#C8B68D] hover:text-[#D4C5A0] transition-colors"
              >
                <X size={24} />
              </button>

              {/* Content */}
              <div className="text-center">
                {/* Seal Icon */}
                <motion.div
                  className="mb-8"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <div
                    className="w-24 h-24 mx-auto rounded-full border-4 flex items-center justify-center"
                    style={{
                      borderColor: "#C8B68D",
                      background:
                        "radial-gradient(circle, rgba(200, 182, 141, 0.1) 0%, transparent 70%)",
                    }}
                  >
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#C8B68D"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                  </div>
                </motion.div>

                {/* Title */}
                <h2
                  className="text-3xl font-serif mb-4 tracking-wider"
                  style={{ color: "#C8B68D" }}
                >
                  THIS SCROLL IS SEALED
                </h2>

                {/* Description */}
                <p
                  className="text-lg mb-2 font-serif"
                  style={{ color: "#C8B68D", opacity: 0.8 }}
                >
                  {bookTitle ? `"${bookTitle}"` : "This ancient tome"}
                </p>
                <p
                  className="text-sm font-mono"
                  style={{ color: "#C8B68D", opacity: 0.6 }}
                >
                  remains locked within the archives.
                </p>
                <p
                  className="text-sm font-mono mt-4"
                  style={{ color: "#C8B68D", opacity: 0.5 }}
                >
                  The knowledge within awaits discovery...
                </p>

                {/* Decorative Line */}
                <div
                  className="mt-8 mx-auto w-32 h-px"
                  style={{
                    background:
                      "linear-gradient(to right, transparent, #312A1D, transparent)",
                  }}
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
