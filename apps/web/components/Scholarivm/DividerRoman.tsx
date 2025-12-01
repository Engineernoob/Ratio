"use client";

import { motion } from "framer-motion";

interface DividerRomanProps {
  className?: string;
  delay?: number;
}

export function DividerRoman({ className = "", delay = 0 }: DividerRomanProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      className={`relative ${className}`}
    >
      {/* Decorative line */}
      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(215, 196, 158, 0.3), transparent)",
        }}
      />

      {/* Roman numerals decoration */}
      <div className="flex items-center justify-center gap-2 mt-2">
        {["I", "II", "III"].map((num, i) => (
          <motion.span
            key={num}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: delay + i * 0.1 }}
            className="font-serif text-xs"
            style={{
              color: "rgba(215, 196, 158, 0.4)",
              letterSpacing: "0.2em",
            }}
          >
            {num}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}
