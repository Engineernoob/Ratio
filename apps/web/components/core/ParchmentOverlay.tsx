"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ParchmentOverlayProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function ParchmentOverlay({
  children,
  className,
  delay = 0,
}: ParchmentOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={cn(
        "relative",
        "bg-linear-to-br from-parchment/10 via-parchment/5 to-transparent",
        "border border-[rgba(201,178,125,0.2)]",
        "backdrop-blur-sm",
        className
      )}
      style={{
        boxShadow:
          "inset 0 1px 2px rgba(255,255,255,0.1), 0 2px 8px rgba(0,0,0,0.3)",
      }}
    >
      {/* Parchment texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: "url('/images/textures/parchment-dither.png')",
          backgroundSize: "200px 200px",
          backgroundRepeat: "repeat",
          mixBlendMode: "overlay",
        }}
      />

      {/* Dither pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          mixBlendMode: "overlay",
        }}
      />

      {/* Ink fade effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.05) 50%, transparent 100%)",
        }}
      />

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
