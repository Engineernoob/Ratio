"use client";

import { motion } from "framer-motion";

export function MemoriaHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center mb-16"
    >
      <h1
        className="font-serif text-7xl md:text-8xl font-bold text-gold mb-8"
        style={{
          textShadow:
            "0 0 40px rgba(215,196,158,0.5), 0 0 80px rgba(215,196,158,0.3)",
          filter: "blur(0.3px)",
        }}
      >
        MEMORIA
      </h1>
      <div className="space-y-3">
        <p className="font-sans text-sm uppercase tracking-[0.25em] text-gold font-light">
          TEMPLVM RECORDATIONIS
        </p>
        <p className="font-sans text-sm uppercase tracking-[0.25em] text-gold font-light">
          SCIENTIA NON RETENTA, SCIENTIA NON EST.
        </p>
      </div>
    </motion.div>
  );
}
