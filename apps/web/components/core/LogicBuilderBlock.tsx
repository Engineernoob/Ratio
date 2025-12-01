"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LogicBuilderBlockProps {
  type: "claim" | "premise" | "fallacy" | "syllogism" | "counterexample";
  children: ReactNode;
  className?: string;
  delay?: number;
  draggable?: boolean;
}

const typeStyles = {
  claim: "border-[rgba(232,230,225,0.3)] bg-[rgba(232,230,225,0.08)]",
  premise: "border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.05)]",
  fallacy: "border-[rgba(255,0,0,0.3)] bg-[rgba(255,0,0,0.1)]",
  syllogism: "border-[rgba(198,122,58,0.3)] bg-[rgba(198,122,58,0.1)]",
  counterexample: "border-[rgba(201,178,125,0.3)] bg-[rgba(201,178,125,0.1)]",
};

const typeLabels = {
  claim: "CLAIM",
  premise: "PREMISE",
  fallacy: "FALLACY",
  syllogism: "SYLLOGISM",
  counterexample: "COUNTEREXAMPLE",
};

export function LogicBuilderBlock({
  type,
  children,
  className,
  delay = 0,
  draggable = false,
}: LogicBuilderBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      drag={draggable}
      className={cn(
        "relative p-4 rounded-sm border backdrop-blur-sm",
        typeStyles[type],
        draggable && "cursor-move",
        className
      )}
      style={{
        boxShadow:
          "inset 0 1px 2px rgba(255,255,255,0.05), 0 2px 8px rgba(0,0,0,0.3)",
      }}
    >
      {/* Stone texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-15 rounded-sm"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='marble'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='3'/%3E%3CfeColorMatrix values='0 0 0 0 0.9 0 0 0 0 0.9 0 0 0 0 0.9 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23marble)' opacity='0.3'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
          mixBlendMode: "overlay",
        }}
      />

      <div className="relative z-10">
        <div className="font-serif text-xs uppercase tracking-widest engraved-text mb-2">
          {typeLabels[type]}
        </div>
        <div className="font-mono text-sm leading-relaxed">{children}</div>
      </div>
    </motion.div>
  );
}
