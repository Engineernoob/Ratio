"use client";

import { motion } from "framer-motion";

interface DustParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export function DustParticles() {
  // Generate 30-50 random particles
  const particleCount = 35 + Math.floor(Math.random() * 20);
  const particles: DustParticle[] = Array.from(
    { length: particleCount },
    (_, i) => ({
      id: i,
      x: Math.random() * 100, // 0-100% of width
      y: Math.random() * 100, // 0-100% of height
      size: 1 + Math.random() * 2, // 1-3px
      duration: 18 + Math.random() * 4, // 18-22s
      delay: Math.random() * 5, // 0-5s initial delay
    })
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: "rgba(232, 230, 225, 0.15)",
            filter: "blur(1px)",
            boxShadow: "0 0 2px rgba(232, 230, 225, 0.2)",
          }}
          animate={{
            y: [0, -20, -40, -60],
            opacity: [0, 0.15, 0.2, 0, 0.1, 0.15, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
