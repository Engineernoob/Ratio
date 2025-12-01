"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

export function ArchivvmEmptyState() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <BookOpen size={64} style={{ color: "rgba(200, 182, 141, 0.3)" }} />
      </motion.div>
      <h3 className="font-serif text-xl mt-6 mb-2" style={{ color: "#C8B68D" }}>
        The Vault Awaits
      </h3>
      <p
        className="font-mono text-sm opacity-60 text-center max-w-md"
        style={{ color: "#C8B68D" }}
      >
        No items found. Start reading and highlighting to build your knowledge
        archive.
      </p>
    </motion.div>
  );
}
