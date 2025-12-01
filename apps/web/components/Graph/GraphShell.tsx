"use client";

import { ReactNode } from "react";
import { LightVignette } from "@/components/ui/LightVignette";
import { DustLayer } from "@/components/ui/DustLayer";
import { CandleFlicker } from "@/components/ui/CandleFlicker";

interface GraphShellProps {
  children: ReactNode;
  theme?: "AUREA" | "SYNAPSE" | "GLACIES" | "CLASSICAL";
}

export function GraphShell({ children, theme = "AUREA" }: GraphShellProps) {
  const themeColors = {
    AUREA: {
      primary: "rgba(215, 196, 158, 0.8)",
      secondary: "rgba(178, 155, 104, 0.6)",
      glow: "rgba(215, 196, 158, 0.3)",
    },
    SYNAPSE: {
      primary: "rgba(100, 200, 255, 0.8)",
      secondary: "rgba(50, 150, 255, 0.6)",
      glow: "rgba(100, 200, 255, 0.3)",
    },
    GLACIES: {
      primary: "rgba(200, 230, 255, 0.8)",
      secondary: "rgba(150, 200, 255, 0.6)",
      glow: "rgba(200, 230, 255, 0.3)",
    },
    CLASSICAL: {
      primary: "rgba(232, 230, 225, 0.8)",
      secondary: "rgba(201, 178, 125, 0.6)",
      glow: "rgba(232, 230, 225, 0.3)",
    },
  };

  const colors = themeColors[theme];

  return (
    <div
      className="relative w-full min-h-screen overflow-hidden"
      style={{ background: "#0A0A0A" }}
    >
      {/* Marble texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='marble'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='3'/%3E%3CfeColorMatrix values='0 0 0 0 0.9 0 0 0 0 0.9 0 0 0 0 0.9 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23marble)' opacity='0.3'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
          mixBlendMode: "overlay",
          zIndex: 0,
        }}
      />

      {/* Dithering texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "url('/images/textures/texture_bayer.png')",
          backgroundSize: "256px 256px",
          backgroundRepeat: "repeat",
          zIndex: 1,
        }}
      />

      {/* Dust Layer */}
      <div className="absolute inset-0" style={{ zIndex: 2 }}>
        <DustLayer particleCount={20} />
      </div>

      {/* Light Vignette */}
      <div className="absolute inset-0" style={{ zIndex: 3 }}>
        <LightVignette intensity={0.1} />
      </div>

      {/* Theme-specific glow overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${colors.glow} 0%, transparent 70%)`,
          opacity: 0.2,
          zIndex: 4,
        }}
      />

      {/* Candle Flicker wrapper */}
      <CandleFlicker intensity={0.02} minInterval={5} maxInterval={12}>
        <div className="relative z-10">{children}</div>
      </CandleFlicker>
    </div>
  );
}
