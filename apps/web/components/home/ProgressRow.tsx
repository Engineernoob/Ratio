"use client";

import { motion } from "framer-motion";

interface ProgressItem {
  label: string;
  value: number;
  max: number;
}

interface ProgressRowProps {
  items: ProgressItem[];
}

export function ProgressRow({ items }: ProgressRowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mb-12"
    >
      <h2 className="font-mono text-sm font-medium text-[#888888] mb-6 tracking-wide uppercase">
        Today's Progress
      </h2>
      <div className="space-y-4">
        {items.map((item, index) => {
          const percentage = Math.min((item.value / item.max) * 100, 100);
          return (
            <div key={item.label} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-mono text-sm text-[#e8e6e1]">
                  {item.label}
                </span>
                <span className="font-mono text-xs text-[#c8b68d]">
                  {item.value} / {item.max}
                </span>
              </div>
              <div className="relative h-1 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{
                    duration: 0.8,
                    delay: 0.5 + index * 0.1,
                    ease: "easeOut",
                  }}
                  className="h-full rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, #c8b68d 0%, #d7c49e 100%)",
                    boxShadow: "0 0 8px rgba(200, 182, 141, 0.3)",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
