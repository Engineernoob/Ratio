"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LedgerItem {
  id: string;
  label: string;
  value?: string | ReactNode;
  sublabel?: string;
}

interface LedgerListProps {
  items: LedgerItem[];
  className?: string;
  delay?: number;
  showDividers?: boolean;
}

export function LedgerList({
  items,
  className,
  delay = 0,
  showDividers = true,
}: LedgerListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={cn(
        "relative",
        "bg-linear-to-br from-fogwhite to-transparent",
        "border border-[rgba(255,255,255,0.08)]",
        "backdrop-blur-sm",
        className
      )}
      style={{
        boxShadow:
          "inset 0 1px 2px rgba(255,255,255,0.05), 0 2px 8px rgba(0,0,0,0.3)",
      }}
    >
      {/* Dither overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          mixBlendMode: "overlay",
        }}
      />

      <div className="relative z-10">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: delay + index * 0.05 }}
            className={cn(
              "p-4",
              showDividers &&
                index < items.length - 1 &&
                "border-b border-[rgba(255,255,255,0.08)]"
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="font-serif text-sm uppercase tracking-widest engraved-text mb-1">
                  {item.label}
                </div>
                {item.sublabel && (
                  <div className="font-mono text-xs text-muted-foreground mt-1">
                    {item.sublabel}
                  </div>
                )}
              </div>
              {item.value && (
                <div className="font-mono text-sm" style={{ color: "#E8E6E1" }}>
                  {item.value}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
