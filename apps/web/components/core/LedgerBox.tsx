"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LedgerBoxProps {
  title: string;
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function LedgerBox({
  title,
  children,
  className,
  delay = 0,
}: LedgerBoxProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={cn(
        "border border-[rgba(255,255,255,0.08)]",
        "bg-[#0A0A0A]",
        "p-6",
        className
      )}
    >
      <h3
        className="font-serif text-lg font-normal tracking-widest uppercase mb-6"
        style={{
          color: "#b29b68",
          textShadow:
            "0px 1px 0 rgba(255, 255, 255, 0.05), 0px -1px 0 rgba(0, 0, 0, 0.9)",
        }}
      >
        {title}
      </h3>
      <div className="font-mono text-xs text-[rgba(255,255,255,0.6)] space-y-3">
        {children}
      </div>
    </motion.div>
  );
}
