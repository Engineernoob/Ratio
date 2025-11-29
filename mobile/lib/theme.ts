export type ThemeId =
  | "AUREA"
  | "UMBRA"
  | "FLAMMA"
  | "AETHER"
  | "NOX"
  | "CHROMA"
  | "GLACIES"
  | "FERRO"
  | "UMBRA_MODICA"
  | "SYNAPSE";

export interface ThemeTransition {
  page: {
    duration: number;
    ease: string;
  };
  card: {
    duration: number;
    ease: string;
  };
  glow: {
    duration: number;
    ease: string;
  };
}

export interface GlowRule {
  selector: string;
  intensity: number;
  color: string;
  blur: number;
}

export interface Theme {
  id: ThemeId;
  name: string;
  description: string;
  accent: string;
  background: string;
  backgroundTexture: string;
  ditherTexture: string;
  vignetteStrength: number;
  fogColor: string;
  grainOpacity: number;
  glowRules: GlowRule[];
  ambientParticleType:
    | "dust"
    | "embers"
    | "sparks"
    | "mist"
    | "void"
    | "grid"
    | "pixels"
    | "lines";
  transitions: ThemeTransition;
  // Modern theme properties
  blur?: number; // Blur amount for glassmorphic effects
  borderStyle?: "solid" | "dashed" | "dotted" | "double" | "none";
  surface?: string; // Surface color for cards/panels
  glowColor?: string; // Specific glow color
  isModern?: boolean; // Flag to indicate modern theme
}

export const themes: Record<ThemeId, Theme> = {
  AUREA: {
    id: "AUREA",
    name: "Aurea",
    description: "Golden light, warm parchment, classical elegance",
    accent: "#C8B68D",
    background: "#0A0A0A",
    backgroundTexture: "/images/textures/parchment-dither.png",
    ditherTexture: "/images/textures/texture_bayer.png",
    vignetteStrength: 0.2,
    fogColor: "rgba(200, 182, 141, 0.15)",
    grainOpacity: 0.04,
    glowRules: [
      {
        selector: ".glow-accent",
        intensity: 0.3,
        color: "rgba(200, 182, 141, 0.3)",
        blur: 20,
      },
    ],
    ambientParticleType: "dust",
    transitions: {
      page: { duration: 0.2, ease: "easeInOut" },
      card: { duration: 0.3, ease: "easeOut" },
      glow: { duration: 0.4, ease: "easeInOut" },
    },
  },
  UMBRA: {
    id: "UMBRA",
    name: "Umbra",
    description: "Deep shadows, silver accents, monastic silence",
    accent: "#9A9A9A",
    background: "#050505",
    backgroundTexture: "/images/textures/stone.png",
    ditherTexture: "/images/textures/texture_bayer.png",
    vignetteStrength: 0.15,
    fogColor: "rgba(154, 154, 154, 0.1)",
    grainOpacity: 0.03,
    glowRules: [
      {
        selector: ".glow-accent",
        intensity: 0.2,
        color: "rgba(154, 154, 154, 0.2)",
        blur: 15,
      },
    ],
    ambientParticleType: "mist",
    transitions: {
      page: { duration: 0.25, ease: "easeInOut" },
      card: { duration: 0.35, ease: "easeOut" },
      glow: { duration: 0.5, ease: "easeInOut" },
    },
  },
  FLAMMA: {
    id: "FLAMMA",
    name: "Flamma",
    description: "Warm embers, amber glow, forge-like intensity",
    accent: "#D4A574",
    background: "#0F0A05",
    backgroundTexture: "/images/textures/charred.png",
    ditherTexture: "/images/textures/texture_bayer.png",
    vignetteStrength: 0.25,
    fogColor: "rgba(212, 165, 116, 0.2)",
    grainOpacity: 0.05,
    glowRules: [
      {
        selector: ".glow-accent",
        intensity: 0.4,
        color: "rgba(212, 165, 116, 0.4)",
        blur: 25,
      },
    ],
    ambientParticleType: "embers",
    transitions: {
      page: { duration: 0.2, ease: "easeInOut" },
      card: { duration: 0.3, ease: "easeOut" },
      glow: { duration: 0.35, ease: "easeInOut" },
    },
  },
  AETHER: {
    id: "AETHER",
    name: "Aether",
    description: "Ethereal blue, cold light, celestial clarity",
    accent: "#8BA4B8",
    background: "#0A0D12",
    backgroundTexture: "/images/textures/frost.png",
    ditherTexture: "/images/textures/texture_bayer.png",
    vignetteStrength: 0.18,
    fogColor: "rgba(139, 164, 184, 0.12)",
    grainOpacity: 0.035,
    glowRules: [
      {
        selector: ".glow-accent",
        intensity: 0.25,
        color: "rgba(139, 164, 184, 0.25)",
        blur: 18,
      },
    ],
    ambientParticleType: "sparks",
    transitions: {
      page: { duration: 0.22, ease: "easeInOut" },
      card: { duration: 0.32, ease: "easeOut" },
      glow: { duration: 0.42, ease: "easeInOut" },
    },
  },
  NOX: {
    id: "NOX",
    name: "Nox",
    description: "Absolute darkness, minimal glow, void-like depth",
    accent: "#6B6B6B",
    background: "#000000",
    backgroundTexture: "/images/textures/void.png",
    ditherTexture: "/images/textures/texture_bayer.png",
    vignetteStrength: 0.1,
    fogColor: "rgba(107, 107, 107, 0.08)",
    grainOpacity: 0.02,
    glowRules: [
      {
        selector: ".glow-accent",
        intensity: 0.15,
        color: "rgba(107, 107, 107, 0.15)",
        blur: 12,
      },
    ],
    ambientParticleType: "void",
    transitions: {
      page: { duration: 0.3, ease: "easeInOut" },
      card: { duration: 0.4, ease: "easeOut" },
      glow: { duration: 0.5, ease: "easeInOut" },
    },
  },
  CHROMA: {
    id: "CHROMA",
    name: "Chroma",
    description: "Monochrome futurist, high contrast, digital precision",
    accent: "#FFFFFF",
    background: "#000000",
    backgroundTexture: "/images/textures/grid.png",
    ditherTexture: "/images/textures/texture_bayer.png",
    vignetteStrength: 0.05,
    fogColor: "rgba(255, 255, 255, 0.05)",
    grainOpacity: 0.01,
    glowRules: [
      {
        selector: ".glow-accent",
        intensity: 0.6,
        color: "rgba(255, 255, 255, 0.6)",
        blur: 30,
      },
    ],
    ambientParticleType: "pixels",
    transitions: {
      page: { duration: 0.15, ease: "easeOut" },
      card: { duration: 0.2, ease: "easeOut" },
      glow: { duration: 0.25, ease: "easeInOut" },
    },
    blur: 0,
    borderStyle: "solid",
    surface: "rgba(255, 255, 255, 0.05)",
    glowColor: "rgba(255, 255, 255, 0.8)",
    isModern: true,
  },
  GLACIES: {
    id: "GLACIES",
    name: "Glacies",
    description: "Glassmorphic, frosted surfaces, translucent depth",
    accent: "#B8D4E3",
    background: "#0A1419",
    backgroundTexture: "/images/textures/frost.png",
    ditherTexture: "/images/textures/texture_bayer.png",
    vignetteStrength: 0.1,
    fogColor: "rgba(184, 212, 227, 0.2)",
    grainOpacity: 0.02,
    glowRules: [
      {
        selector: ".glow-accent",
        intensity: 0.4,
        color: "rgba(184, 212, 227, 0.4)",
        blur: 40,
      },
    ],
    ambientParticleType: "mist",
    transitions: {
      page: { duration: 0.2, ease: "easeInOut" },
      card: { duration: 0.3, ease: "easeOut" },
      glow: { duration: 0.4, ease: "easeInOut" },
    },
    blur: 20,
    borderStyle: "solid",
    surface: "rgba(184, 212, 227, 0.1)",
    glowColor: "rgba(184, 212, 227, 0.5)",
    isModern: true,
  },
  FERRO: {
    id: "FERRO",
    name: "Ferro",
    description: "Modern brutalist, stark edges, bold geometry",
    accent: "#FF4444",
    background: "#1A1A1A",
    backgroundTexture: "/images/textures/concrete.png",
    ditherTexture: "/images/textures/texture_bayer.png",
    vignetteStrength: 0.08,
    fogColor: "rgba(255, 68, 68, 0.1)",
    grainOpacity: 0.03,
    glowRules: [
      {
        selector: ".glow-accent",
        intensity: 0.5,
        color: "rgba(255, 68, 68, 0.5)",
        blur: 15,
      },
    ],
    ambientParticleType: "lines",
    transitions: {
      page: { duration: 0.18, ease: "easeOut" },
      card: { duration: 0.25, ease: "easeOut" },
      glow: { duration: 0.3, ease: "easeInOut" },
    },
    blur: 0,
    borderStyle: "solid",
    surface: "rgba(255, 68, 68, 0.08)",
    glowColor: "rgba(255, 68, 68, 0.6)",
    isModern: true,
  },
  UMBRA_MODICA: {
    id: "UMBRA_MODICA",
    name: "Umbra Modica",
    description: "Material modern, subtle elevation, refined shadows",
    accent: "#9E9E9E",
    background: "#121212",
    backgroundTexture: "/images/textures/stone.png",
    ditherTexture: "/images/textures/texture_bayer.png",
    vignetteStrength: 0.12,
    fogColor: "rgba(158, 158, 158, 0.12)",
    grainOpacity: 0.025,
    glowRules: [
      {
        selector: ".glow-accent",
        intensity: 0.3,
        color: "rgba(158, 158, 158, 0.3)",
        blur: 25,
      },
    ],
    ambientParticleType: "mist",
    transitions: {
      page: { duration: 0.22, ease: "easeInOut" },
      card: { duration: 0.32, ease: "easeOut" },
      glow: { duration: 0.42, ease: "easeInOut" },
    },
    blur: 10,
    borderStyle: "solid",
    surface: "rgba(158, 158, 158, 0.06)",
    glowColor: "rgba(158, 158, 158, 0.4)",
    isModern: true,
  },
  SYNAPSE: {
    id: "SYNAPSE",
    name: "Synapse",
    description: "Neo-cybernetic, grid networks, digital pulse",
    accent: "#00FF88",
    background: "#000000",
    backgroundTexture: "/images/textures/grid.png",
    ditherTexture: "/images/textures/texture_bayer.png",
    vignetteStrength: 0.06,
    fogColor: "rgba(0, 255, 136, 0.08)",
    grainOpacity: 0.015,
    glowRules: [
      {
        selector: ".glow-accent",
        intensity: 0.7,
        color: "rgba(0, 255, 136, 0.7)",
        blur: 35,
      },
    ],
    ambientParticleType: "grid",
    transitions: {
      page: { duration: 0.12, ease: "easeOut" },
      card: { duration: 0.18, ease: "easeOut" },
      glow: { duration: 0.22, ease: "easeInOut" },
    },
    blur: 5,
    borderStyle: "dashed",
    surface: "rgba(0, 255, 136, 0.05)",
    glowColor: "rgba(0, 255, 136, 0.9)",
    isModern: true,
  },
};

export function getTheme(id: ThemeId): Theme {
  return themes[id];
}

export function getAllThemes(): Theme[] {
  return Object.values(themes);
}
