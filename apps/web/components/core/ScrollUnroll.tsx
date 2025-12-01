"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ScrollUnrollProps {
  children: ReactNode;
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export function ScrollUnroll({
  children,
  title,
  isOpen,
  onToggle,
  className,
}: ScrollUnrollProps) {
  return (
    <div className={cn("relative", className)}>
      <motion.button
        onClick={onToggle}
        className="w-full text-left"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="font-serif text-xl uppercase tracking-widest engraved-text mb-4">
          {title}
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="overflow-hidden"
          >
            {/* Cylindrical reveal effect */}
            <motion.div
              initial={{ scaleY: 0, transformOrigin: "top" }}
              animate={{ scaleY: 1 }}
              exit={{ scaleY: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative"
            >
              {/* Fog fade overlay */}
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 100%)",
                }}
              />

              <div className="relative z-10 pt-4">{children}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
