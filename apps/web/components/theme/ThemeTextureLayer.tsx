"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

export function ThemeTextureLayer() {
  const { currentTheme } = useTheme();

  return (
    <>
      {/* Background Texture */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `var(--texture-bg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.15,
          zIndex: 0,
        }}
        animate={{
          opacity: [0.12, 0.15, 0.12],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Dither Texture */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `var(--texture-dither)`,
          backgroundSize: "256px 256px",
          backgroundRepeat: "repeat",
          opacity: `var(--grain)`,
          mixBlendMode: "overlay",
          zIndex: 1,
        }}
        key={currentTheme.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: parseFloat(currentTheme.grainOpacity.toString()) }}
        transition={{ duration: 0.2 }}
      />
    </>
  );
}
