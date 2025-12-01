"use client";

import { motion } from "framer-motion";

interface RitualHeaderProps {
  title: string;
  subtitle?: string;
}

export function RitualHeader({ title, subtitle }: RitualHeaderProps) {
  return (
    <motion.div
      className="text-center mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1
        className="font-serif text-5xl mb-3"
        style={{
          color: "#C8B68D",
          textShadow: "0px 2px 8px rgba(0, 0, 0, 0.5)",
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          className="font-mono text-sm opacity-60"
          style={{ color: "#C8B68D" }}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
