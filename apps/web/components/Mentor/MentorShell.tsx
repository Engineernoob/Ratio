"use client";

import { ReactNode } from "react";
import { LightVignette } from "@/components/ui/LightVignette";
import { DustLayer } from "@/components/ui/DustLayer";
import { CandleFlicker } from "@/components/ui/CandleFlicker";

interface MentorShellProps {
  children: ReactNode;
}

export function MentorShell({ children }: MentorShellProps) {
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
        <DustLayer particleCount={25} />
      </div>

      {/* Light Vignette */}
      <div className="absolute inset-0" style={{ zIndex: 3 }}>
        <LightVignette intensity={0.12} />
      </div>

      {/* Candle Flicker wrapper */}
      <CandleFlicker intensity={0.03} minInterval={4} maxInterval={10}>
        <div className="relative z-10">{children}</div>
      </CandleFlicker>
    </div>
  );
}
