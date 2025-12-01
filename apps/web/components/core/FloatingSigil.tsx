"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FloatingSigilProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  delay?: number;
}

const sizeClasses = {
  sm: "w-16 h-16 text-2xl",
  md: "w-24 h-24 text-3xl",
  lg: "w-32 h-32 text-4xl",
};

export function FloatingSigil({
  children,
  className,
  size = "md",
  delay = 0,
}: FloatingSigilProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, -8, 0],
      }}
      transition={{
        opacity: { duration: 0.6, delay, ease: "easeOut" },
        scale: { duration: 0.6, delay, ease: "easeOut" },
        y: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay + 0.6,
        },
      }}
      className={cn(
        "relative flex items-center justify-center",
        "bg-gradient-to-br from-fogwhite to-transparent",
        "border border-[rgba(255,255,255,0.1)] rounded-full",
        "backdrop-blur-sm",
        sizeClasses[size],
        className
      )}
      style={{
        boxShadow:
          "inset 0 2px 8px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.4), 0 0 24px rgba(232, 230, 225, 0.15)",
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
      
      {/* Inner glow */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, rgba(232, 230, 225, 0.1) 0%, transparent 70%)",
        }}
      />
      
      <span className="relative z-10 font-serif">{children}</span>
    </motion.div>
  );
}

