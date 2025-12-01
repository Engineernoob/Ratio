"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EngravedTitleProps {
  children: ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  delay?: number;
}

const sizeClasses = {
  1: "text-6xl md:text-7xl",
  2: "text-5xl md:text-6xl",
  3: "text-4xl md:text-5xl",
  4: "text-3xl md:text-4xl",
  5: "text-2xl md:text-3xl",
  6: "text-xl md:text-2xl",
};

export function EngravedTitle({
  children,
  level = 1,
  className,
  delay = 0,
}: EngravedTitleProps) {
  const Component = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
    >
      <Component
        className={cn(
          "font-serif font-normal uppercase tracking-[0.12em] engraved-text",
          sizeClasses[level],
          className
        )}
        style={{
          textShadow:
            "2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(255,255,255,0.1), 0 0 20px rgba(232, 230, 225, 0.2)",
          color: "#d7c49e",
        }}
      >
        {children}
      </Component>
    </motion.div>
  );
}
