"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { MentorPersona } from "@/lib/mentor/types";
import { getPersonaDescription } from "@/lib/mentor/persona";

interface MentorAvatarProps {
  persona: MentorPersona;
  isTyping?: boolean;
}

export function MentorAvatar({ persona, isTyping = false }: MentorAvatarProps) {
  const [pulse, setPulse] = useState(1);

  useEffect(() => {
    if (isTyping) {
      const interval = setInterval(() => {
        setPulse(1 + Math.sin(Date.now() / 500) * 0.1);
      }, 50);
      return () => clearInterval(interval);
    } else {
      setPulse(1);
    }
  }, [isTyping]);

  const desc = getPersonaDescription(persona);

  return (
    <motion.div
      animate={{
        scale: pulse,
        filter: isTyping
          ? `brightness(${1 + Math.sin(Date.now() / 300) * 0.2})`
          : "brightness(1)",
      }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-full blur-xl"
        style={{
          background: `radial-gradient(circle, rgba(215, 196, 158, ${
            isTyping ? 0.4 : 0.2
          }) 0%, transparent 70%)`,
          transform: "scale(1.5)",
        }}
      />

      {/* Avatar circle */}
      <div
        className="relative w-16 h-16 rounded-full border-2 flex items-center justify-center text-2xl"
        style={{
          borderColor: "rgba(215, 196, 158, 0.4)",
          background: "rgba(10, 10, 10, 0.8)",
          boxShadow: "0 0 20px rgba(215, 196, 158, 0.3)",
        }}
      >
        {/* Marble texture */}
        <div
          className="absolute inset-0 rounded-full opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='marble'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='3'/%3E%3CfeColorMatrix values='0 0 0 0 0.9 0 0 0 0 0.9 0 0 0 0 0.9 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23marble)' opacity='0.3'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
            mixBlendMode: "overlay",
          }}
        />

        <div className="relative z-10">{desc.icon}</div>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: "#d7c49e" }}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
