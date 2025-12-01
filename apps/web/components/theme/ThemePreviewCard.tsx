"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { Theme } from "@/lib/theme";

interface ThemePreviewCardProps {
  theme: Theme;
  isSelected: boolean;
  onClick: () => void;
}

export function ThemePreviewCard({
  theme,
  isSelected,
  onClick,
}: ThemePreviewCardProps) {
  const isModern = theme.isModern || false;
  const borderStyle = theme.borderStyle || "solid";
  const blur = theme.blur || 0;
  const surface = theme.surface || "rgba(255, 255, 255, 0.05)";

  return (
    <motion.button
      onClick={onClick}
      className="text-left p-6 relative overflow-hidden"
      style={{
        background:
          isModern && blur > 0
            ? `linear-gradient(135deg, ${surface}, ${surface}00)`
            : isSelected
            ? "rgba(200, 182, 141, 0.15)"
            : "rgba(10, 10, 10, 0.7)",
        backdropFilter: isModern && blur > 0 ? `blur(${blur}px)` : "none",
        borderRadius: isModern && theme.id === "FERRO" ? "0" : "0.5rem",
        border: `2px ${borderStyle} ${
          isSelected ? `${theme.accent}66` : `${theme.accent}33`
        }`,
        boxShadow: isModern
          ? `0 8px 32px ${theme.glowColor || theme.accent}20`
          : "none",
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Preview Background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: theme.background,
          backgroundImage: `url('${theme.backgroundTexture}')`,
          backgroundSize: "cover",
        }}
      />

      {/* Modern Theme Specific Previews */}
      {isModern && (
        <>
          {/* GLACIES - Glass blur effect */}
          {theme.id === "GLACIES" && (
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(184, 212, 227, 0.1) 0%, rgba(184, 212, 227, 0.05) 100%)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(184, 212, 227, 0.2)",
              }}
            />
          )}

          {/* SYNAPSE - Cyber grid */}
          {theme.id === "SYNAPSE" && (
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 255, 136, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0, 255, 136, 0.1) 1px, transparent 1px)`,
                backgroundSize: "20px 20px",
              }}
            />
          )}

          {/* FERRO - Brutalist blocks */}
          {theme.id === "FERRO" && (
            <div className="absolute inset-0">
              <div
                className="absolute top-0 left-0 w-1/2 h-1/2"
                style={{
                  background: "rgba(255, 68, 68, 0.1)",
                  borderRight: "2px solid rgba(255, 68, 68, 0.3)",
                  borderBottom: "2px solid rgba(255, 68, 68, 0.3)",
                }}
              />
              <div
                className="absolute bottom-0 right-0 w-1/3 h-1/3"
                style={{
                  background: "rgba(255, 68, 68, 0.05)",
                  borderTop: "2px solid rgba(255, 68, 68, 0.3)",
                  borderLeft: "2px solid rgba(255, 68, 68, 0.3)",
                }}
              />
            </div>
          )}

          {/* CHROMA - High contrast */}
          {theme.id === "CHROMA" && (
            <div
              className="absolute inset-0"
              style={{
                background:
                  "repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.03) 4px)",
              }}
            />
          )}
        </>
      )}

      {/* Accent Preview */}
      <div
        className="absolute top-4 right-4 w-12 h-12 rounded-full"
        style={{
          background: theme.accent,
          opacity: 0.6,
          boxShadow: `0 0 20px ${theme.glowColor || theme.accent}40`,
          borderRadius: isModern && theme.id === "FERRO" ? "0" : "50%",
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-serif text-xl" style={{ color: theme.accent }}>
            {theme.name}
          </h3>
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Check size={20} style={{ color: theme.accent }} />
            </motion.div>
          )}
        </div>
        <p
          className="font-mono text-xs opacity-60 mb-4"
          style={{ color: theme.accent }}
        >
          {theme.description}
        </p>

        {/* Theme Properties */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span
              className="font-mono text-xs opacity-50"
              style={{ color: theme.accent }}
            >
              Accent:
            </span>
            <div
              className="w-4 h-4 rounded"
              style={{ background: theme.accent }}
            />
          </div>
          <div className="flex items-center gap-2">
            <span
              className="font-mono text-xs opacity-50"
              style={{ color: theme.accent }}
            >
              Particles:
            </span>
            <span className="font-mono text-xs" style={{ color: theme.accent }}>
              {theme.ambientParticleType}
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
