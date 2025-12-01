"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbBarProps {
  items: BreadcrumbItem[];
  className?: string;
  delay?: number;
}

export function BreadcrumbBar({
  items,
  className,
  delay = 0,
}: BreadcrumbBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={cn(
        "flex items-center gap-2 font-mono text-xs uppercase tracking-wider",
        "text-muted-foreground mb-6",
        className
      )}
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <span className="text-muted-foreground/50">—</span>
          )}
          {item.href ? (
            <a
              href={item.href}
              className="hover:text-foreground transition-colors"
            >
              {item.label}
            </a>
          ) : (
            <span>{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </motion.div>
  );
}

