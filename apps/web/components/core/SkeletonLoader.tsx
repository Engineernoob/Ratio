"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SkeletonLoaderProps {
  className?: string;
  variant?: "text" | "card" | "circle";
  lines?: number;
}

export function SkeletonLoader({
  className,
  variant = "card",
  lines = 3,
}: SkeletonLoaderProps) {
  if (variant === "text") {
    return (
      <div className={cn("space-y-2", className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.1,
            }}
            className="h-4 bg-muted rounded"
            style={{ width: i === lines - 1 ? "60%" : "100%" }}
          />
        ))}
      </div>
    );
  }

  if (variant === "circle") {
    return (
      <motion.div
        initial={{ opacity: 0.3 }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className={cn("rounded-full bg-muted", className)}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0.3 }}
      animate={{ opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className={cn("rounded-lg bg-muted dither", className)}
    />
  );
}

