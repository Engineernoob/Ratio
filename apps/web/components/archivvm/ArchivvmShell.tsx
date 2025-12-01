"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { LightVignette } from "@/components/ui/LightVignette";
import { DustLayer } from "@/components/ui/DustLayer";
import { CandleFlicker } from "@/components/ui/CandleFlicker";

interface ArchivvmShellProps {
  children: ReactNode;
}

export function ArchivvmShell({ children }: ArchivvmShellProps) {
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
        <DustLayer particleCount={30} />
      </div>

      {/* Light Vignette */}
      <div className="absolute inset-0" style={{ zIndex: 2 }}>
        <LightVignette intensity={0.2} />
      </div>

      {/* Candle Flicker wrapper */}
      <CandleFlicker intensity={0.04} minInterval={5} maxInterval={12}>
        <div className="relative z-10">{children}</div>
      </CandleFlicker>
    </div>
  );
}
