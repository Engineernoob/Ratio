// tailwind.config.js
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#000000",
        gravestone: "#111111",
        marble: "#1A1A1A",
        ivory: "#E8E6E1",
        parchment: "#C9B27D",
        bronze: "#9C7E4F",
        wax: "#923434",
        fogwhite: "rgba(255,255,255,0.04)",
        deepfog: "rgba(0,0,0,0.3)",
        gold: "#d7c49eff",
      },

      fontFamily: {
        serif: ["EB Garamond", "Cormorant Garamond", "serif"],
        mono: ["IBM Plex Mono", "JetBrains Mono", "monospace"],
      },

      boxShadow: {
        stone: "0 0 24px rgba(255,255,255,0.05)",
        glow: "0 0 16px rgba(201,178,125,0.25)",
        "gold-glow": "0 0 20px rgba(215,196,158,0.3)",
        "inset-neu":
          "inset 0 2px 4px rgba(0,0,0,0.4), inset 0 -2px 4px rgba(255,255,255,0.05), 0 0 30px rgba(0,0,0,0.5)",
      },

      spacing: {
        4.5: "1.125rem",
        18: "4.5rem",
      },

      backgroundImage: {
        noise: "url('/images/textures/texture_bayer.png')",
        dither: "url('/images/textures/texture_bayer.png')",
        parchment: "url('/images/textures/parchment-dither.png')",
        acropolis: "url('/images/backgrounds/acropolis-dithered.png')",
      },

      animation: {
        fadeup: "fadeup 0.6s ease-out",
        fogmove: "fogmove 18s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
      },

      keyframes: {
        fadeup: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fogmove: {
          "0%": { opacity: 0.03 },
          "50%": { opacity: 0.06 },
          "100%": { opacity: 0.03 },
        },
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
};
