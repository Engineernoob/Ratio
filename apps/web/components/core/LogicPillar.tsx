"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LogicPillarProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function LogicPillar({
  title,
  subtitle,
  children,
  className,
  delay = 0,
}: LogicPillarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={cn("relative border text-card-foreground", className)}
      style={{
        background: "rgba(0, 0, 0, 0.35)",
        backdropFilter: "blur(1px)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.05), 0 2px 8px rgba(0,0,0,0.3)",
      }}
    >
      <div className="relative z-10 p-6">
        <div className="mb-4">
          <h3 className="font-serif text-xl uppercase tracking-widest engraved-text mb-1">
            {title}
          </h3>
          <p className="font-serif text-xs uppercase tracking-wider text-muted-foreground">
            {subtitle}
          </p>
        </div>
        {children}
      </div>
    </motion.div>
  );
}
