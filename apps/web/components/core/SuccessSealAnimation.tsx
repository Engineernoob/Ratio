"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface SuccessSealAnimationProps {
  show: boolean;
  message?: string;
  onComplete?: () => void;
  className?: string;
}

export function SuccessSealAnimation({
  show,
  message,
  onComplete,
  className,
}: SuccessSealAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center pointer-events-none",
            className
          )}
        >
          {/* Stamped gold circle seal */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, ease: "backOut" }}
            className="relative w-32 h-32"
            style={{
              background: "radial-gradient(circle, rgba(198,122,58,0.9) 0%, rgba(198,122,58,0.6) 100%)",
              borderRadius: "50%",
              boxShadow:
                "inset 0 2px 8px rgba(255,255,255,0.2), 0 0 40px rgba(198,122,58,0.6), 0 0 80px rgba(198,122,58,0.3)",
            }}
          >
            {/* Dither overlay */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none opacity-30"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                mixBlendMode: "overlay",
              }}
            />

            {/* Check mark */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="absolute inset-0 flex items-center justify-center text-4xl font-serif text-white"
            >
              ✓
            </motion.div>

            {/* Message */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="absolute top-full mt-4 text-center"
              >
                <p className="font-mono text-xs uppercase tracking-wider text-bronze">
                  {message}
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

