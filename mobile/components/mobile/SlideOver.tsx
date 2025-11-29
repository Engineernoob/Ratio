"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { ReactNode } from "react";

interface SlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  side?: "left" | "right" | "bottom";
}

export function SlideOver({
  isOpen,
  onClose,
  title,
  children,
  side = "right",
}: SlideOverProps) {
  const { currentTheme } = useTheme();

  const variants = {
    left: {
      initial: { x: "-100%" },
      animate: { x: 0 },
      exit: { x: "-100%" },
    },
    right: {
      initial: { x: "100%" },
      animate: { x: 0 },
      exit: { x: "100%" },
    },
    bottom: {
      initial: { y: "100%" },
      animate: { y: 0 },
      exit: { y: "100%" },
    },
  };

  const slideVariant = variants[side];

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
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          {/* Slide Over Panel */}
          <motion.div
            initial={slideVariant.initial}
            animate={slideVariant.animate}
            exit={slideVariant.exit}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed z-50 ${
              side === "bottom"
                ? "bottom-0 left-0 right-0 max-h-[90vh] rounded-t-2xl"
                : side === "left"
                ? "left-0 top-0 bottom-0 w-full max-w-sm"
                : "right-0 top-0 bottom-0 w-full max-w-sm"
            }`}
            style={{
              background: `rgba(${
                currentTheme.background === "#000000" ? "0,0,0" : "10,10,10"
              }, 0.98)`,
              borderTop:
                side === "bottom"
                  ? `1px solid ${currentTheme.accent}33`
                  : "none",
              borderLeft:
                side === "left" ? `1px solid ${currentTheme.accent}33` : "none",
              borderRight:
                side === "right"
                  ? `1px solid ${currentTheme.accent}33`
                  : "none",
              boxShadow: `0 0 40px ${currentTheme.accent}20`,
            }}
          >
            {/* Header */}
            {(title || true) && (
              <div
                className="flex items-center justify-between p-4 border-b"
                style={{ borderColor: `${currentTheme.accent}33` }}
              >
                {title && (
                  <h2
                    className="font-serif text-lg"
                    style={{ color: currentTheme.accent }}
                  >
                    {title}
                  </h2>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-opacity-20 transition-colors"
                  style={{
                    color: currentTheme.accent,
                    background: `${currentTheme.accent}10`,
                  }}
                >
                  <X size={20} />
                </button>
              </div>
            )}

            {/* Content */}
            <div className="overflow-y-auto h-full pb-20 safe-area-bottom">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
