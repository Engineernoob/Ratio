"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ContextPanelProps {
  children: ReactNode;
  title?: string;
}

export function ContextPanel({ children, title }: ContextPanelProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-80 border-l backdrop-blur-sm overflow-y-auto dither grain relative"
      style={{
        background: `linear-gradient(to bottom right, var(--surface, color-mix(in srgb, var(--accent-color, var(--accent)) 2%, transparent)), var(--surface, color-mix(in srgb, var(--accent-color, var(--accent)) 1%, transparent)))`,
        backdropFilter: `blur(var(--blur, 4px))`,
        borderColor:
          "color-mix(in srgb, var(--accent-color, var(--accent)) 20%, transparent)",
        borderStyle: `var(--border-style, solid)`,
      }}
    >
      <div className="p-6">
        {title && (
          <div
            className="mb-6 border-b pb-4"
            style={{
              borderColor: "color-mix(in srgb, var(--accent) 20%, transparent)",
            }}
          >
            <h2
              className="font-serif text-xl font-semibold engraved engrave"
              style={{ color: "var(--accent)" }}
            >
              {title}
            </h2>
          </div>
        )}
        <div className="space-y-6">{children}</div>
      </div>
    </motion.aside>
  );
}
