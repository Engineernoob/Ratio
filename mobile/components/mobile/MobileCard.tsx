"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

interface MobileCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  delay?: number;
  variant?: "default" | "elevated" | "flat";
}

export function MobileCard({
  children,
  className,
  onClick,
  delay = 0,
  variant = "default",
}: MobileCardProps) {
  const { currentTheme } = useTheme();

  const variants = {
    default: {
      background: `rgba(${
        currentTheme.background === "#000000" ? "0,0,0" : "10,10,10"
      }, 0.8)`,
      border: `1px solid ${currentTheme.accent}33`,
      boxShadow: `0 2px 8px ${currentTheme.accent}10`,
    },
    elevated: {
      background: `rgba(${
        currentTheme.background === "#000000" ? "0,0,0" : "10,10,10"
      }, 0.9)`,
      border: `1px solid ${currentTheme.accent}40`,
      boxShadow: `0 4px 16px ${currentTheme.accent}20`,
    },
    flat: {
      background: `rgba(${
        currentTheme.background === "#000000" ? "0,0,0" : "10,10,10"
      }, 0.6)`,
      border: `1px solid ${currentTheme.accent}20`,
      boxShadow: "none",
    },
  };

  const style = variants[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: "easeOut" }}
      className={cn(
        "rounded-lg p-4",
        onClick && "cursor-pointer active:scale-[0.98]",
        className
      )}
      style={style}
      onClick={onClick}
      whileTap={onClick ? { scale: 0.98 } : undefined}
    >
      {children}
    </motion.div>
  );
}
