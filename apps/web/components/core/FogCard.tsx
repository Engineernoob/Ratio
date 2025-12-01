"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FogCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  delay?: number;
}

export function FogCard({
  children,
  className,
  onClick,
  hover = false,
  delay = 0,
}: FogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : {}}
      onClick={onClick}
      className={cn(
        "relative rounded-lg border border-[rgba(255,255,255,0.08)]",
        "bg-linear-to-br from-[rgba(255,255,255,0.03)] to-transparent",
        "backdrop-blur-sm",
        "transition-all duration-300",
        hover && "cursor-pointer",
        hover && "hover:border-[rgba(212,175,55,0.3)]",
        className
      )}
      style={{
        boxShadow:
          "0 0 30px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.3)",
      }}
    >
      {/* Animated grain texture overlay */}
      <div
        className="absolute inset-0 rounded-lg pointer-events-none opacity-[0.04] animate-fogmove"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          mixBlendMode: "overlay",
        }}
      />

      {/* Soft internal glow */}
      <div
        className="absolute inset-0 rounded-lg pointer-events-none opacity-30"
        style={{
          background:
            "radial-gradient(circle at center, rgba(232, 230, 225, 0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
