"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeaderEngravedProps {
  title: string;
  subtitle?: string;
  className?: string;
  delay?: number;
}

export function SectionHeaderEngraved({
  title,
  subtitle,
  className,
  delay = 0,
}: SectionHeaderEngravedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={cn("mb-6", className)}
    >
      <h2
        className="font-serif text-2xl font-normal tracking-widest uppercase mb-2"
        style={{
          color: "#b29b68",
          textShadow:
            "0px 1px 0 rgba(255, 255, 255, 0.05), 0px -1px 0 rgba(0, 0, 0, 0.9)",
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="font-mono text-xs text-[rgba(255,255,255,0.5)] tracking-wider uppercase">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
