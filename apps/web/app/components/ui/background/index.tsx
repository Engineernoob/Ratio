"use client";

import { AnimatedBackground } from "@/components/home";

interface BackgroundProps {
  imageUrl?: string;
}

export function Background({
  imageUrl = "/images/backgrounds/acropolis-dithered.png",
}: BackgroundProps) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-black" />
      <AnimatedBackground imageUrl={imageUrl} />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black" />
      <div
        className="absolute inset-0 pointer-events-none opacity-20 mix-blend-screen"
        style={{
          backgroundImage: "radial-gradient(circle at 20% 20%, #111 0, transparent 30%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.08]"
        style={{
          backgroundImage: "url('/images/textures/texture_bayer.png')",
          backgroundSize: "220px 220px",
          backgroundRepeat: "repeat",
        }}
      />
    </div>
  );
}
