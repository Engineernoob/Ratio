"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  delay?: number;
}

export function SectionHeader({
  title,
  subtitle,
  className,
  delay = 0,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      className={cn("relative mb-12", className)}
    >
      {/* Halo glow behind text */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(232, 230, 225, 0.15) 0%, transparent 70%)",
          filter: "blur(20px)",
          transform: "scale(1.2)",
        }}
      />

      <div className="relative z-10">
        <h1
          className="font-serif text-5xl md:text-6xl font-normal tracking-widest uppercase mb-4 engraved-text"
          style={{
            textShadow:
              "2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(255,255,255,0.1), 0 0 30px rgba(232, 230, 225, 0.3)",
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="font-mono text-sm text-muted-foreground tracking-widest uppercase">
            {subtitle}
          </p>
        )}
      </div>
    </motion.div>
  );
}
