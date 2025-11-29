"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { ThemeId, Theme } from "@/lib/theme";
import { getTheme } from "@/lib/theme";

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (id: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>("AUREA");
  const [currentTheme, setCurrentTheme] = useState<Theme>(getTheme("AUREA"));

  // Load theme from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("ratio-theme");
    if (stored) {
      const validThemes: ThemeId[] = [
        "AUREA",
        "UMBRA",
        "FLAMMA",
        "AETHER",
        "NOX",
        "CHROMA",
        "GLACIES",
        "FERRO",
        "UMBRA_MODICA",
        "SYNAPSE",
      ];
      if (validThemes.includes(stored as ThemeId)) {
        setThemeId(stored as ThemeId);
        setCurrentTheme(getTheme(stored as ThemeId));
      }
    }
  }, []);

  // Update CSS variables when theme changes
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent", currentTheme.accent);
    root.style.setProperty("--accent-color", currentTheme.accent);
    root.style.setProperty("--fog", currentTheme.fogColor);
    root.style.setProperty(
      "--glow",
      currentTheme.glowRules[0]?.color || currentTheme.accent
    );
    root.style.setProperty(
      "--glow-color",
      currentTheme.glowColor ||
        currentTheme.glowRules[0]?.color ||
        currentTheme.accent
    );
    root.style.setProperty("--grain", currentTheme.grainOpacity.toString());
    root.style.setProperty(
      "--texture-bg",
      `url('${currentTheme.backgroundTexture}')`
    );
    root.style.setProperty(
      "--texture-dither",
      `url('${currentTheme.ditherTexture}')`
    );
    root.style.setProperty(
      "--texture-vignette",
      currentTheme.vignetteStrength.toString()
    );
    root.style.setProperty("--background", currentTheme.background);

    // Modern theme variables
    root.style.setProperty(
      "--surface",
      currentTheme.surface || "rgba(255, 255, 255, 0.05)"
    );
    root.style.setProperty("--blur", `${currentTheme.blur || 0}px`);
    root.style.setProperty(
      "--border-style",
      currentTheme.borderStyle || "solid"
    );

    // Also set RGB values for easier rgba() usage
    const hex = currentTheme.accent.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    root.style.setProperty("--accent-rgb", `${r}, ${g}, ${b}`);
  }, [currentTheme]);

  const handleSetTheme = (id: ThemeId) => {
    setThemeId(id);
    const newTheme = getTheme(id);
    setCurrentTheme(newTheme);
    localStorage.setItem("ratio-theme", id);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme: handleSetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
