"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { getAllThemes, type ThemeId } from "@/lib/theme";

export function ThemeSwitcher() {
  const { currentTheme, setTheme } = useTheme();
  const themes = getAllThemes();

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {themes.map((theme) => (
        <motion.button
          key={theme.id}
          onClick={() => setTheme(theme.id)}
          className="px-4 py-2 font-mono text-xs rounded"
          style={{
            color:
              currentTheme.id === theme.id ? theme.accent : `${theme.accent}80`,
            border: `1px solid ${
              currentTheme.id === theme.id ? theme.accent : `${theme.accent}40`
            }`,
            background:
              currentTheme.id === theme.id
                ? `${theme.accent}15`
                : "rgba(10, 10, 10, 0.6)",
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {theme.name}
        </motion.button>
      ))}
    </div>
  );
}
