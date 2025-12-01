"use client";

import { motion } from "framer-motion";

export function FloatingLight() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Main glow orb */}
      <motion.div
        className="absolute"
        style={{
          left: "50%",
          top: "35%",
          width: "120px",
          height: "120px",
          marginLeft: "-60px",
          marginTop: "-60px",
          background:
            "radial-gradient(circle, rgba(255, 230, 180, 0.25) 0%, rgba(255, 230, 180, 0.1) 40%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(20px)",
        }}
        animate={{
          x: [0, 8, -6, 4, 0],
          y: [0, -4, 6, -3, 0],
          scale: [1, 1.05, 0.98, 1.02, 1],
          opacity: [0.25, 0.3, 0.22, 0.28, 0.25],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Secondary smaller glow */}
      <motion.div
        className="absolute"
        style={{
          left: "48%",
          top: "38%",
          width: "60px",
          height: "60px",
          marginLeft: "-30px",
          marginTop: "-30px",
          background:
            "radial-gradient(circle, rgba(255, 230, 180, 0.4) 0%, rgba(255, 230, 180, 0.15) 50%, transparent 80%)",
          borderRadius: "50%",
          filter: "blur(12px)",
        }}
        animate={{
          x: [0, -4, 3, -2, 0],
          y: [0, 3, -2, 1, 0],
          opacity: [0.4, 0.45, 0.35, 0.42, 0.4],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
