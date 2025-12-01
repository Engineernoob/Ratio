"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReaderSettings } from "./ReaderModal";

interface ReaderSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ReaderSettings;
  onSettingsChange: (settings: ReaderSettings) => void;
}

export function ReaderSettingsPanel({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
}: ReaderSettingsPanelProps) {
  const updateSetting = <K extends keyof ReaderSettings>(
    key: K,
    value: ReaderSettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#0d0d0d] border-t border-white/5 p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-xl text-[#e8e8e8]">
                  Reading Settings
                </h3>
                <button
                  onClick={onClose}
                  className="font-mono text-lg text-[#e8e8e8] hover:bg-white/5 px-3 py-2 transition-colors rounded"
                >
                  ×
                </button>
              </div>

              {/* Font Family */}
              <div>
                <label className="font-mono text-sm text-[#888] mb-3 block">
                  Font Family
                </label>
                <div className="flex gap-2">
                  {(["serif", "sans-serif"] as const).map((family) => (
                    <button
                      key={family}
                      onClick={() => updateSetting("fontFamily", family)}
                      className={`px-4 py-2.5 font-mono text-xs border transition-all duration-200 rounded ${
                        settings.fontFamily === family
                          ? "bg-[#e8e8e8] text-[#0d0d0d] border-[#e8e8e8]"
                          : "bg-transparent text-[#e8e8e8] border-white/10 hover:border-white/20"
                      }`}
                    >
                      {family === "serif" ? "Serif" : "Sans-serif"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div>
                <label className="font-mono text-sm text-[#888] mb-3 block">
                  Font Size: {settings.fontSize}px
                </label>
                <input
                  type="range"
                  min="16"
                  max="22"
                  value={settings.fontSize}
                  onChange={(e) =>
                    updateSetting("fontSize", parseInt(e.target.value))
                  }
                  className="w-full accent-[#e8e8e8]"
                />
              </div>

              {/* Line Height */}
              <div>
                <label className="font-mono text-sm text-[#888] mb-3 block">
                  Line Height: {settings.lineHeight.toFixed(1)}
                </label>
                <input
                  type="range"
                  min="1.6"
                  max="1.9"
                  step="0.1"
                  value={settings.lineHeight}
                  onChange={(e) =>
                    updateSetting("lineHeight", parseFloat(e.target.value))
                  }
                  className="w-full accent-[#e8e8e8]"
                />
              </div>

              {/* Column Width */}
              <div>
                <label className="font-mono text-sm text-[#888] mb-3 block">
                  Column Width
                </label>
                <div className="flex gap-2">
                  {(["narrow", "normal", "wide"] as const).map((width) => (
                    <button
                      key={width}
                      onClick={() => updateSetting("columnWidth", width)}
                      className={`px-4 py-2.5 font-mono text-xs border transition-all duration-200 rounded ${
                        settings.columnWidth === width
                          ? "bg-[#e8e8e8] text-[#0d0d0d] border-[#e8e8e8]"
                          : "bg-transparent text-[#e8e8e8] border-white/10 hover:border-white/20"
                      }`}
                    >
                      {width.charAt(0).toUpperCase() + width.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reading Mode */}
              <div>
                <label className="font-mono text-sm text-[#888] mb-3 block">
                  Reading Mode
                </label>
                <div className="flex gap-2">
                  {(["scroll", "page"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => updateSetting("readingMode", mode)}
                      className={`px-4 py-2.5 font-mono text-xs border transition-all duration-200 rounded ${
                        settings.readingMode === mode
                          ? "bg-[#e8e8e8] text-[#0d0d0d] border-[#e8e8e8]"
                          : "bg-transparent text-[#e8e8e8] border-white/10 hover:border-white/20"
                      }`}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme */}
              <div>
                <label className="font-mono text-sm text-[#888] mb-3 block">
                  Theme
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { id: "monochrome", label: "Monochrome" },
                      { id: "sepia", label: "Sepia" },
                      { id: "oled", label: "OLED Pure Black" },
                      { id: "solarized", label: "Solarized Midnight" },
                    ] as const
                  ).map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => updateSetting("theme", theme.id)}
                      className={`px-4 py-3 font-mono text-xs border transition-all duration-200 rounded text-left ${
                        settings.theme === theme.id
                          ? "bg-[#e8e8e8] text-[#0d0d0d] border-[#e8e8e8]"
                          : "bg-transparent text-[#e8e8e8] border-white/10 hover:border-white/20"
                      }`}
                    >
                      {theme.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
