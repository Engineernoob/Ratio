"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PanelContainerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function PanelContainer({
  children,
  className,
  delay = 0,
}: PanelContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      whileHover={{
        filter: "brightness(1.02)",
        transition: { duration: 0.2 },
      }}
      className={cn(
        "relative border",
        "transition-all duration-300",
        className
      )}
      style={{
        background: "rgba(0, 0, 0, 0.35)",
        backdropFilter: "blur(1px)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05)",
      }}
    >
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
