"use client";

import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="text-center mb-32 md:mb-40"
    >
      <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-6 text-[#e8e6e1]">
        SALVE, SCHOLAR
      </h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="font-mono text-sm md:text-base text-[#888888] tracking-wide"
      >
        INITIUM SAPIENTIAE EST COGNITIO SUI
      </motion.p>
    </motion.div>
  );
}
