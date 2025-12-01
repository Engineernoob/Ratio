"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ResultModalProps {
  isOpen: boolean;
  title: string;
  content: React.ReactNode;
  onClose: () => void;
}

export function ResultModal({
  isOpen,
  title,
  content,
  onClose,
}: ResultModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50"
            style={{ background: "rgba(0, 0, 0, 0.85)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <motion.div
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto p-8 rounded-lg"
              style={{
                background: "#0A0A0A",
                border: "1px solid rgba(200, 182, 141, 0.3)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2
                  className="font-serif text-2xl"
                  style={{ color: "#C8B68D" }}
                >
                  {title}
                </h2>
                <motion.button
                  onClick={onClose}
                  style={{ color: "#C8B68D" }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={24} />
                </motion.button>
              </div>
              {content}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
