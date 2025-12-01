"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface FeatureCardProps {
  title: string;
  preview: string;
  href: string;
  cta?: string;
  delay?: number;
}

export function FeatureCard({
  title,
  preview,
  href,
  cta = "Continue →",
  delay = 0,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Link href={href}>
        <div
          className="group relative h-full p-6 rounded-2xl border transition-all duration-300 cursor-pointer"
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            borderColor: "rgba(200, 182, 141, 0.15)",
            boxShadow:
              "0 4px 20px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(200, 182, 141, 0.05)",
          }}
        >
          <div className="flex flex-col h-full">
            <h3 className="font-serif text-2xl mb-2 text-[#e8e6e1]">{title}</h3>
            <p className="font-mono text-sm text-[#888888] mb-4 grow">
              {preview}
            </p>
            <div className="flex items-center text-[#c8b68d] text-sm font-medium group-hover:translate-x-1 transition-transform duration-200">
              {cta}
              <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </div>

          {/* Subtle glow on hover */}
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              boxShadow:
                "0 0 40px rgba(200, 182, 141, 0.1), inset 0 0 0 1px rgba(200, 182, 141, 0.2)",
            }}
          />
        </div>
      </Link>
    </motion.div>
  );
}
