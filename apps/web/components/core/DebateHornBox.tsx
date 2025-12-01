"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DebateHornBoxProps {
  title: string;
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function DebateHornBox({
  title,
  children,
  className,
  delay = 0,
}: DebateHornBoxProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={cn(
        "border border-[rgba(255,255,255,0.08)]",
        "bg-obsidian",
        "p-4 mb-4",
        className
      )}
    >
      <div
        className="font-serif text-sm uppercase tracking-widest mb-3"
        style={{ color: "#b29b68" }}
      >
        {title}
      </div>
      <div className="font-mono text-xs text-[rgba(255,255,255,0.7)] leading-relaxed">
        {children}
      </div>
    </motion.div>
  );
}
