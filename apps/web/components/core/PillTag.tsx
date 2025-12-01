"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PillTagProps {
  label: string;
  variant?:
    | "LECTIO"
    | "RITUAL"
    | "MEMORIA"
    | "EXERCITIA"
    | "THEATRVM"
    | "LOGICA"
    | "PARADOXUM"
    | "PUZZLE"
    | "default";
  className?: string;
  onClick?: () => void;
}

const variantStyles = {
  LECTIO: "border-[rgba(232,230,225,0.2)] bg-[rgba(232,230,225,0.05)]",
  RITUAL: "border-[rgba(198,122,58,0.3)] bg-[rgba(198,122,58,0.1)]",
  MEMORIA: "border-[rgba(201,178,125,0.3)] bg-[rgba(201,178,125,0.1)]",
  EXERCITIA: "border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.05)]",
  THEATRVM: "border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.03)]",
  LOGICA: "border-[rgba(232,230,225,0.25)] bg-[rgba(232,230,225,0.08)]",
  PARADOXUM: "border-[rgba(198,122,58,0.25)] bg-[rgba(198,122,58,0.08)]",
  PUZZLE: "border-[rgba(201,178,125,0.25)] bg-[rgba(201,178,125,0.08)]",
  default: "border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)]",
};

export function PillTag({
  label,
  variant = "default",
  className,
  onClick,
}: PillTagProps) {
  const Component = onClick ? motion.button : motion.div;

  return (
    <Component
      whileHover={onClick ? { scale: 1.05 } : {}}
      whileTap={onClick ? { scale: 0.95 } : {}}
      onClick={onClick}
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full",
        "font-mono text-[10px] uppercase tracking-wider",
        "border backdrop-blur-sm",
        "transition-all duration-200",
        variantStyles[variant] || variantStyles.default,
        onClick && "cursor-pointer",
        className
      )}
      style={{
        boxShadow: "inset 0 1px 2px rgba(255,255,255,0.05), 0 1px 4px rgba(0,0,0,0.2)",
      }}
    >
      {label}
    </Component>
  );
}

