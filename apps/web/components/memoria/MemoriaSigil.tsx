"use client";

import { motion } from "framer-motion";
import { FloatingSigil } from "@/components/core/FloatingSigil";

export function MemoriaSigil() {
  return (
    <div className="memoria-empty-sigil">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="memoria-sigil-ring"
      />
      <FloatingSigil size="lg" className="memoria-sigil-core">
        ✺
      </FloatingSigil>
    </div>
  );
}
