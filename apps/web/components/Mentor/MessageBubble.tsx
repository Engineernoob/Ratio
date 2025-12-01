"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import type { MentorMessage } from "@/lib/mentor/types";

interface MessageBubbleProps {
  message: MentorMessage;
  index: number;
}

export function MessageBubble({ message, index }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`max-w-[80%] md:max-w-[70%] rounded-sm p-4 relative ${
          isUser ? "border-l-2" : "border-r-2"
        }`}
        style={{
          borderColor: isUser
            ? "rgba(215, 196, 158, 0.3)"
            : "rgba(215, 196, 158, 0.4)",
          background: isUser
            ? "rgba(215, 196, 158, 0.05)"
            : "rgba(215, 196, 158, 0.08)",
          boxShadow:
            "inset 0 1px 2px rgba(255,255,255,0.05), 0 2px 8px rgba(0,0,0,0.3)",
        }}
      >
        {/* Marble texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-5 rounded-sm"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='marble'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='3'/%3E%3CfeColorMatrix values='0 0 0 0 0.9 0 0 0 0 0.9 0 0 0 0 0.9 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23marble)' opacity='0.3'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
            mixBlendMode: "overlay",
          }}
        />

        <div className="relative z-10">
          {/* Role indicator */}
          <div
            className="font-mono text-xs uppercase mb-2"
            style={{ color: "rgba(215, 196, 158, 0.5)" }}
          >
            {isUser ? "YOU" : "MENTOR"}
          </div>

          {/* Message content */}
          <div
            className="font-mono text-sm leading-relaxed whitespace-pre-wrap"
            style={{ color: "rgba(232, 230, 225, 0.9)" }}
          >
            {message.content}
          </div>

          {/* Timestamp */}
          <div
            className="font-mono text-xs mt-2 opacity-50"
            style={{ color: "rgba(215, 196, 158, 0.4)" }}
          >
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
