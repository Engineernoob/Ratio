"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { Theme } from "@/lib/theme";

interface ReadingSettingsProps {
  onClose: () => void;
  theme: Theme;
}

export function ReadingSettings({ onClose, theme }: ReadingSettingsProps) {
  const [fontSize, setFontSize] = useState(16);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [fontFamily, setFontFamily] = useState<"serif" | "sans">("serif");
  const [pageWidth, setPageWidth] = useState(800);
  const [backgroundTexture, setBackgroundTexture] = useState(true);

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem("reading-settings");
    if (saved) {
      const settings = JSON.parse(saved);
      setFontSize(settings.fontSize || 16);
      setLineHeight(settings.lineHeight || 1.6);
      setFontFamily(settings.fontFamily || "serif");
      setPageWidth(settings.pageWidth || 800);
      setBackgroundTexture(settings.backgroundTexture !== false);
    }
  }, []);

  const saveSettings = () => {
    const settings = {
      fontSize,
      lineHeight,
      fontFamily,
      pageWidth,
      backgroundTexture,
    };
    localStorage.setItem("reading-settings", JSON.stringify(settings));

    // Apply to document
    document.documentElement.style.setProperty(
      "--reading-font-size",
      `${fontSize}px`
    );
    document.documentElement.style.setProperty(
      "--reading-line-height",
      lineHeight.toString()
    );
    document.documentElement.style.setProperty(
      "--reading-font-family",
      fontFamily === "serif" ? "serif" : "sans-serif"
    );
    document.documentElement.style.setProperty(
      "--reading-page-width",
      `${pageWidth}px`
    );
  };

  useEffect(() => {
    saveSettings();
  }, [fontSize, lineHeight, fontFamily, pageWidth, backgroundTexture]);

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed bottom-0 left-0 right-0 z-50 p-6 border-t"
      style={{
        background: theme.background + "F0",
        borderColor: theme.accent + "20",
        backdropFilter: "blur(20px)",
        maxHeight: "60vh",
        overflowY: "auto",
      }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-xl" style={{ color: theme.accent }}>
            Reading Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded transition-colors"
            style={{
              color: theme.accent,
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = theme.accent + "10";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Font Size */}
          <div>
            <label
              className="block font-mono text-sm mb-2"
              style={{ color: theme.accent }}
            >
              Font Size: {fontSize}px
            </label>
            <input
              type="range"
              min="12"
              max="24"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full"
              style={{
                accentColor: theme.accent,
              }}
            />
          </div>

          {/* Line Height */}
          <div>
            <label
              className="block font-mono text-sm mb-2"
              style={{ color: theme.accent }}
            >
              Line Height: {lineHeight.toFixed(1)}
            </label>
            <input
              type="range"
              min="1.2"
              max="2.5"
              step="0.1"
              value={lineHeight}
              onChange={(e) => setLineHeight(Number(e.target.value))}
              className="w-full"
              style={{
                accentColor: theme.accent,
              }}
            />
          </div>

          {/* Font Family */}
          <div>
            <label
              className="block font-mono text-sm mb-2"
              style={{ color: theme.accent }}
            >
              Font Family
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setFontFamily("serif")}
                className="px-4 py-2 rounded font-mono text-sm transition-colors"
                style={{
                  background:
                    fontFamily === "serif"
                      ? theme.accent + "20"
                      : "transparent",
                  border: `1px solid ${theme.accent}40`,
                  color: theme.accent,
                }}
              >
                Serif
              </button>
              <button
                onClick={() => setFontFamily("sans")}
                className="px-4 py-2 rounded font-mono text-sm transition-colors"
                style={{
                  background:
                    fontFamily === "sans" ? theme.accent + "20" : "transparent",
                  border: `1px solid ${theme.accent}40`,
                  color: theme.accent,
                }}
              >
                Sans
              </button>
            </div>
          </div>

          {/* Page Width */}
          <div>
            <label
              className="block font-mono text-sm mb-2"
              style={{ color: theme.accent }}
            >
              Page Width: {pageWidth}px
            </label>
            <input
              type="range"
              min="600"
              max="1200"
              step="50"
              value={pageWidth}
              onChange={(e) => setPageWidth(Number(e.target.value))}
              className="w-full"
              style={{
                accentColor: theme.accent,
              }}
            />
          </div>

          {/* Background Texture */}
          <div>
            <label
              className="block font-mono text-sm mb-2"
              style={{ color: theme.accent }}
            >
              Background Texture
            </label>
            <button
              onClick={() => setBackgroundTexture(!backgroundTexture)}
              className="px-4 py-2 rounded font-mono text-sm transition-colors"
              style={{
                background: backgroundTexture
                  ? theme.accent + "20"
                  : "transparent",
                border: `1px solid ${theme.accent}40`,
                color: theme.accent,
              }}
            >
              {backgroundTexture ? "Enabled" : "Disabled"}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
