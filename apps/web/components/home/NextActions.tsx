"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface ActionItem {
  id: string;
  title: string;
  description: string;
  href: string;
}

interface NextActionsProps {
  items: ActionItem[];
  seeAllHref?: string;
}

export function NextActions({
  items,
  seeAllHref = "/scholarivm",
}: NextActionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="p-6 rounded-2xl border"
      style={{
        background: "rgba(255, 255, 255, 0.02)",
        borderColor: "rgba(200, 182, 141, 0.15)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-mono text-base font-medium text-[#e8e6e1]">
          Next Actions
        </h2>
        <Link
          href={seeAllHref}
          className="font-mono text-xs text-[#888888] hover:text-[#c8b68d] transition-colors flex items-center"
        >
          See All
          <ArrowRight className="ml-1 h-3 w-3" />
        </Link>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.6 + index * 0.05 }}
          >
            <Link href={item.href}>
              <div className="group py-3 border-b border-[rgba(255,255,255,0.05)] last:border-0 cursor-pointer">
                <h3 className="font-mono text-sm font-medium text-[#e8e6e1] mb-1 group-hover:text-[#c8b68d] transition-colors">
                  {item.title}
                </h3>
                <p className="font-mono text-xs text-[#888888] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
