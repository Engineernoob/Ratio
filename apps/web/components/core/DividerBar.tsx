"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DividerBarProps {
  className?: string;
  delay?: number;
}

export function DividerBar({ className, delay = 0 }: DividerBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={cn(
        "h-px my-6",
        "bg-linear-to-r",
        "from-transparent via-gold to-transparent",
        "border-dotted border-t border-[rgba(198,122,58,0.2)]",
        className
      )}
      style={{
        backgroundImage:
          "repeating-linear-gradient(to right, transparent, transparent 2px, rgba(198,122,58,0.2) 2px, rgba(198,122,58,0.2) 4px)",
      }}
    />
  );
}
