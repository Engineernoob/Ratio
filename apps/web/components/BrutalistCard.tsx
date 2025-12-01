"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BrutalistCardProps {
  children: ReactNode;
  className?: string;
  borderWidth?: "1" | "1.5";
}

export function BrutalistCard({ 
  children, 
  className,
  borderWidth = "1"
}: BrutalistCardProps) {
  const borderClass = borderWidth === "1.5" ? "border-[1.5px]" : "border-[1px]";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -2 }}
      className={cn(
        "border border-border bg-card text-card-foreground dither grain relative floating-panel panel-shadow",
        borderClass,
        className
      )}
    >
      {children}
    </motion.div>
  );
}
