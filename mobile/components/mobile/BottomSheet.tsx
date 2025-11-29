"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { ReactNode } from "react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  snapPoints?: number[]; // Heights in percentage (0-100)
}

export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  snapPoints = [50, 90],
}: BottomSheetProps) {
  const { currentTheme } = useTheme();
  const [snapIndex, setSnapIndex] = useState(0);

  const currentSnap = snapPoints[snapIndex] || snapPoints[0];

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

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: `${100 - currentSnap}%` }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragEnd={(_, info) => {
              const threshold = 50;
              if (info.offset.y > threshold && snapIndex > 0) {
                setSnapIndex(snapIndex - 1);
              } else if (
                info.offset.y < -threshold &&
                snapIndex < snapPoints.length - 1
              ) {
                setSnapIndex(snapIndex + 1);
              } else if (info.offset.y > threshold * 2) {
                onClose();
              }
            }}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl"
            style={{
              background: `rgba(${
                currentTheme.background === "#000000" ? "0,0,0" : "10,10,10"
              }, 0.98)`,
              borderTop: `1px solid ${currentTheme.accent}33`,
              boxShadow: `0 -4px 40px ${currentTheme.accent}20`,
              maxHeight: `${currentSnap}vh`,
            }}
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div
                className="w-12 h-1 rounded-full"
                style={{ background: `${currentTheme.accent}40` }}
              />
            </div>

            {/* Header */}
            {title && (
              <div
                className="flex items-center justify-between px-4 pb-4 border-b"
                style={{ borderColor: `${currentTheme.accent}33` }}
              >
                <h2
                  className="font-serif text-lg"
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
