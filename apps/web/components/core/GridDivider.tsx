"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GridDividerProps {
  className?: string;
  delay?: number;
}

export function GridDivider({ className, delay = 0 }: GridDividerProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={cn("h-px w-full", "bg-[rgba(255,255,255,0.05)]", className)}
    />
  );
}
