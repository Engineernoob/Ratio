"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LogicNodeProps {
  children: ReactNode;
  title?: string;
  className?: string;
  delay?: number;
  position?: { x: number; y: number };
  draggable?: boolean;
}

export function LogicNode({
  children,
  title,
  className,
  delay = 0,
  position,
  draggable = false,
}: LogicNodeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      drag={draggable}
      dragConstraints={
        draggable ? { left: 0, right: 0, top: 0, bottom: 0 } : undefined
      }
      className={cn(
        "relative",
        "bg-linear-to-br from-fogwhite to-transparent",
        "border border-[rgba(255,255,255,0.1)] rounded-lg",
        "backdrop-blur-sm",
        draggable && "cursor-move",
        className
      )}
      style={{
        boxShadow:
          "inset 0 1px 2px rgba(255,255,255,0.05), 0 4px 16px rgba(0,0,0,0.4), 0 0 20px rgba(232, 230, 225, 0.1)",
        ...(position ? { x: position.x, y: position.y } : {}),
      }}
    >
      {/* Dither overlay */}
      <div
        className="absolute inset-0 rounded-lg pointer-events-none opacity-25"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          mixBlendMode: "overlay",
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-4">
        {title && (
          <div className="mb-2">
            <h4 className="font-serif text-sm uppercase tracking-widest engraved-text">
              {title}
            </h4>
          </div>
        )}
        <div className="font-mono text-xs text-muted-foreground leading-relaxed">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
