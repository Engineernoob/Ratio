"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

export function ThemeFogLayer() {
  const { currentTheme } = useTheme();

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none"
      style={{
        background: `radial-gradient(ellipse at center, transparent 0%, transparent 40%, var(--fog) 70%, var(--fog) 100%)`,
        zIndex: 2,
      }}
      key={currentTheme.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    />
  );
}
