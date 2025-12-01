"use client";

import { useEffect, useRef } from "react";

type BackgroundPosition = "center" | "top" | "bottom";

interface BackgroundArtProps {
  src: string;
  opacity: number;
  blur?: number;
  fade?: boolean;
  position?: BackgroundPosition;
  parallax?: boolean;
}

const objectPositionMap: Record<BackgroundPosition, string> = {
  center: "center center",
  top: "center top",
  bottom: "center bottom",
};

export function BackgroundArt({
  src,
  opacity,
  blur = 0,
  fade = true,
  position = "center",
  parallax = true,
}: BackgroundArtProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  const clampedOpacity = Math.min(Math.max(opacity, 0), 1);

  useEffect(() => {
    if (!parallax) return;

    const handleScroll = () => {
      if (!layerRef.current) return;
      const offset = Math.min(3, Math.max(1, window.scrollY * 0.01));
      layerRef.current.style.setProperty("--parallax-offset", `${offset}px`);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [parallax]);

  return (
    <div
      className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden ${
        fade ? "fade-in-slow" : ""
      }`}
      aria-hidden
    >
      <div
        ref={layerRef}
        className={`absolute inset-0 ${parallax ? "scroll-parallax" : ""}`}
        style={{ ["--parallax-offset" as string]: "0px" }}
      >
        <img
          src={src}
          alt=""
          className="h-full w-full object-cover"
          style={{
            opacity: clampedOpacity,
            filter: `grayscale(100%) contrast(112%)${blur ? ` blur(${blur}px)` : ""}`,
            objectPosition: objectPositionMap[position],
            transform: "translateZ(0)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/70" />
        <div className="absolute inset-0 bg-vignette mix-blend-multiply" />
      </div>
    </div>
  );
}
