"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  descriptor?: string;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  descriptor,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("text-center mb-8 relative", className)}>
      {/* Soft ambient glow behind header */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(215,196,158,0.15) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="font-serif text-5xl md:text-6xl font-bold uppercase tracking-[0.12em] mb-2"
        style={{
          textShadow:
            "2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(255,255,255,0.1)",
        }}
      >
        {title}
      </motion.h1>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-serif text-lg md:text-xl uppercase tracking-widest mb-2"
        >
          {subtitle}
        </motion.p>
      )}

      {descriptor && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-mono text-xs md:text-sm text-muted-foreground"
        >
          {descriptor}
        </motion.p>
      )}

      {/* Gold divider */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-6 h-px bg-[rgba(249,248,247,0.96)]"
      />
    </div>
  );
}
