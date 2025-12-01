"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface OrangeActionProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  active?: boolean;
  as?: "button" | "div";
  disabled?: boolean;
}

export function OrangeAction({
  children,
  onClick,
  className,
  active = false,
  as = "button",
  disabled = false,
}: OrangeActionProps) {
  const Component = as;
  
  return (
    <motion.div
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      <Component
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "border border-border px-4 py-2 font-mono text-sm transition-all ritual-glow shrink-flash",
          "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background",
          disabled
            ? "opacity-50 cursor-not-allowed"
            : active
            ? "bg-accent text-accent-foreground border-accent hover:bg-accent/90"
            : "bg-background text-foreground hover:bg-accent/10",
          className
        )}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
      >
        {children}
      </Component>
    </motion.div>
  );
}
