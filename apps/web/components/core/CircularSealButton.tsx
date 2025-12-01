"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CircularSealButtonProps {
  children: ReactNode;
  onClick?: () => void;
  symbol?: "continue" | "check" | "command" | "dot" | ReactNode;
  className?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-12 h-12 text-base",
  md: "w-16 h-16 text-xl",
  lg: "w-20 h-20 text-2xl",
};

const symbolMap = {
  continue: "→",
  check: "✓",
  command: "⌘",
  dot: "•",
};

export function CircularSealButton({
  children,
  onClick,
  symbol = "dot",
  className,
  disabled = false,
  size = "md",
}: CircularSealButtonProps) {
  const symbolContent =
    typeof symbol === "string" ? symbolMap[symbol as keyof typeof symbolMap] : symbol;

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.1 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative flex flex-col items-center justify-center",
        "bg-linear-to-br from-[rgba(198,122,58,0.2)] to-[rgba(198,122,58,0.1)]",
        "border border-[rgba(198,122,58,0.4)] rounded-full",
        "backdrop-blur-sm",
        sizeClasses[size],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      style={{
        boxShadow:
          "inset 0 2px 4px rgba(255,255,255,0.1), 0 4px 12px rgba(0,0,0,0.3), 0 0 20px rgba(198,122,58,0.2)",
      }}
    >
      {/* Dither overlay */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          mixBlendMode: "overlay",
        }}
      />

      {/* Symbol */}
      <span className="relative z-10 font-serif mb-1">{symbolContent}</span>

      {/* Label */}
      <span className="relative z-10 font-mono text-[8px] uppercase tracking-wider text-bronze">
        {children}
      </span>
    </motion.button>
  );
}

