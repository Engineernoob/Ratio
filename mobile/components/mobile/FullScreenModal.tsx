"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { ReactNode } from "react";

interface FullScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function FullScreenModal({
  isOpen,
  onClose,
  title,
  children,
}: FullScreenModalProps) {
  const { currentTheme } = useTheme();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md"
          />

          {/* Full Screen Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 flex flex-col"
            style={{
              background: `rgba(${
                currentTheme.background === "#000000" ? "0,0,0" : "10,10,10"
              }, 0.98)`,
            }}
          >
            {/* Header */}
            {title && (
              <div
                className="flex items-center justify-between px-4 py-4 border-b"
                style={{ borderColor: `${currentTheme.accent}33` }}
              >
                <h2
                  className="font-serif text-xl"
                  style={{ color: currentTheme.accent }}
                >
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-opacity-20 transition-colors"
                  style={{
                    color: currentTheme.accent,
                    background: `${currentTheme.accent}10`,
                  }}
                >
                  <X size={24} />
                </button>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto pb-20 safe-area-bottom">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
