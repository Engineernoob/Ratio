"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface MinimalRowProps {
  title: string;
  content: string;
  href: string;
  cta?: string;
  delay?: number;
}

export function MinimalRow({
  title,
  content,
  href,
  cta = "Continue →",
  delay = 0,
}: MinimalRowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className="group"
    >
      <Link href={href}>
        <div className="flex items-center justify-between py-8 border-b border-white/5 hover:border-white/20 transition-colors">
          <div className="flex-1">
            <h3 className="font-serif text-2xl mb-2 text-[#f5f5f3] group-hover:text-white transition-colors tracking-[0.08em]">
              {title}
            </h3>
            <p className="font-mono text-sm text-[#9ca3af] leading-relaxed">
              {content}
            </p>
          </div>
          <div className="ml-8 flex items-center text-white/70 text-sm font-medium opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200">
            {cta}
            <ArrowRight className="ml-2 h-4 w-4" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
