"use client";

import { ReactNode } from "react";
import { LightVignette } from "@/components/ui/LightVignette";
import { DustLayer } from "@/components/ui/DustLayer";
import { CandleFlicker } from "@/components/ui/CandleFlicker";

interface ArsRationisShellProps {
  children: ReactNode;
}

export function ArsRationisShell({ children }: ArsRationisShellProps) {
  return (
    <div
      className="relative w-full min-h-screen overflow-hidden"
      style={{ background: "#0A0A0A" }}
    >
      {/* Dithering texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "url('/images/textures/texture_bayer.png')",
          backgroundSize: "256px 256px",
          backgroundRepeat: "repeat",
          zIndex: 0,
        }}
      />

      {/* Dust Layer */}
      <div className="absolute inset-0" style={{ zIndex: 1 }}>
        <DustLayer particleCount={15} />
      </div>

      {/* Light Vignette */}
      <div className="absolute inset-0" style={{ zIndex: 2 }}>
        <LightVignette intensity={0.12} />
      </div>

      {/* Candle Flicker wrapper */}
      <CandleFlicker intensity={0.025} minInterval={6} maxInterval={14}>
        <div className="relative z-10">{children}</div>
      </CandleFlicker>
    </div>
  );
}
