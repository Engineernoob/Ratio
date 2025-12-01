"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  lectioCount?: number;
  ritusCount?: number;
  memoriaCount?: number;
  className?: string;
}

export function HeroSection({
  lectioCount = 3,
  ritusCount = 2,
  memoriaCount = 7,
  className,
}: HeroSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn("mb-12", className)}
    >
      <h1
        className="font-serif text-5xl md:text-6xl font-bold mb-4 tracking-tight"
        style={{ color: "var(--accent)" }}
      >
        SALVE, SCHOLAR
      </h1>

      <p
        className="font-sans text-sm mb-8 uppercase tracking-wider"
        style={{ color: "color-mix(in srgb, var(--accent) 50%, transparent)" }}
      >
        INITIUM SAPIENTIAE EST COGNITIO SUI
      </p>

      <div
        className="flex flex-wrap items-center gap-6 font-mono text-xs uppercase tracking-wider"
        style={{ color: "color-mix(in srgb, var(--accent) 70%, transparent)" }}
      >
        <div className="flex items-center gap-2">
          <span
            style={{
              color: "color-mix(in srgb, var(--accent) 50%, transparent)",
            }}
          >
            LECTIO
          </span>
          <span
            style={{
              color: "color-mix(in srgb, var(--accent) 50%, transparent)",
            }}
          >
            •
          </span>
          <span>{lectioCount} TEXTVS</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            style={{
              color: "color-mix(in srgb, var(--accent) 50%, transparent)",
            }}
          >
            RITVS
          </span>
          <span
            style={{
              color: "color-mix(in srgb, var(--accent) 50%, transparent)",
            }}
          >
            •
          </span>
          <span>{ritusCount} EXERCITIA</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            style={{
              color: "color-mix(in srgb, var(--accent) 50%, transparent)",
            }}
          >
            MEMORIA
          </span>
          <span
            style={{
              color: "color-mix(in srgb, var(--accent) 50%, transparent)",
            }}
          >
            •
          </span>
          <span>{memoriaCount} REVISIONES</span>
        </div>
      </div>
    </motion.div>
  );
}
