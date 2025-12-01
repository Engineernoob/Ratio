"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { EngravedHeader } from "./EngravedHeader";
import { OrangeAction } from "./OrangeAction";

interface ModalPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

export function ModalPanel({
  isOpen,
  onClose,
  title,
  children,
  className,
}: ModalPanelProps) {
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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "fixed inset-0 z-50 flex items-center justify-center p-4",
              className
            )}
          >
            <div
              className={cn(
                "relative w-full max-w-3xl max-h-[90vh] overflow-y-auto",
                "bg-linear-to-br from-fogwhite to-transparent",
                "border border-[rgba(255,255,255,0.12)]",
                "backdrop-blur-sm",
                "p-8"
              )}
              style={{
                boxShadow:
                  "inset 0 2px 8px rgba(0,0,0,0.3), 0 8px 32px rgba(0,0,0,0.5)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Dither overlay */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  mixBlendMode: "overlay",
                }}
              />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <EngravedHeader level={3}>{title}</EngravedHeader>
                  <OrangeAction onClick={onClose} className="text-sm">
                    Close
                  </OrangeAction>
                </div>

                <div className="font-mono text-sm leading-relaxed text-muted-foreground">
                  {children}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
