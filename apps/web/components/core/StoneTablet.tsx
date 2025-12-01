"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StoneTabletProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
  delay?: number;
}

export function StoneTablet({
  children,
  title,
  subtitle,
  className,
  delay = 0,
}: StoneTabletProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={cn(
        "relative",
        "bg-linear-to-br from-[rgba(255,255,255,0.08)] via-[rgba(255,255,255,0.04)] to-[rgba(255,255,255,0.02)]",
        "border border-[rgba(255,255,255,0.12)] rounded-sm",
        "backdrop-blur-sm",
        "transition-all duration-300",
        "hover:border-[rgba(198,122,58,0.3)]",
        "hover:shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_40px_rgba(198,122,58,0.2)]",
        className
      )}
      style={{
        boxShadow:
          "inset 0 2px 8px rgba(0,0,0,0.3), inset 0 -1px 4px rgba(255,255,255,0.05), 0 4px 24px rgba(0,0,0,0.4)",
      }}
    >
      <div className="relative p-8">
        {/* Stone texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='marble'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='3'/%3E%3CfeColorMatrix values='0 0 0 0 0.9 0 0 0 0 0.9 0 0 0 0 0.9 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23marble)' opacity='0.3'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
            mixBlendMode: "overlay",
          }}
        />

        {/* Dither overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-15"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            mixBlendMode: "overlay",
          }}
        />

        {/* Engraved Title */}
        <div className="mb-4 relative z-10">
          <h3
            className="font-serif text-xl uppercase tracking-widest engraved-text mb-2"
            style={{ color: "#c67a3a" }}
          >
            {title}
          </h3>
          {subtitle && (
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="relative z-10">{children}</div>
      </div>
    </motion.div>
  );
}
