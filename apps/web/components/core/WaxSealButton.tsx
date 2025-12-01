"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface WaxSealButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export function WaxSealButton({
  children,
  onClick,
  className,
  disabled = false,
}: WaxSealButtonProps) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative",
        "px-6 py-3",
        "font-serif text-sm uppercase tracking-widest",
        "text-bronze",
        "bg-linear-to-br from-[rgba(198,122,58,0.15)] to-[rgba(198,122,58,0.08)]",
        "border border-[rgba(198,122,58,0.3)] rounded-full",
        "backdrop-blur-sm",
        "transition-all duration-300",
        "hover:border-[rgba(198,122,58,0.5)]",
        "hover:shadow-[0_4px_16px_rgba(198,122,58,0.3)]",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      style={{
        boxShadow:
          "inset 0 1px 2px rgba(255,255,255,0.1), 0 2px 8px rgba(0,0,0,0.3)",
      }}
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(circle at center, rgba(198,122,58,0.2) 0%, transparent 70%)",
        }}
      />

      {/* Dither overlay */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          mixBlendMode: "overlay",
        }}
      />

      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
