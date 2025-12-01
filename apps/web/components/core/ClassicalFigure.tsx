import { cn } from "@/lib/utils";

interface ClassicalFigureProps {
  className?: string;
}

// SVG geometric classical figure (statue-like silhouette with dithering effect)
export function ClassicalFigure({ className }: ClassicalFigureProps) {
  return (
    <div className={cn("w-full h-48 flex items-center justify-center dither grain relative", className)}>
      <svg
        viewBox="0 0 200 300"
        className="w-32 h-48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Classical statue silhouette - geometric, severe */}
        {/* Head */}
        <rect x="85" y="10" width="30" height="35" fill="currentColor" opacity="0.9" />
        {/* Neck */}
        <rect x="92" y="45" width="16" height="20" fill="currentColor" opacity="0.8" />
        {/* Torso */}
        <rect x="70" y="65" width="60" height="100" fill="currentColor" opacity="0.7" />
        {/* Left arm */}
        <rect x="50" y="75" width="20" height="70" fill="currentColor" opacity="0.6" />
        {/* Right arm */}
        <rect x="130" y="75" width="20" height="70" fill="currentColor" opacity="0.6" />
        {/* Left leg */}
        <rect x="75" y="165" width="25" height="90" fill="currentColor" opacity="0.6" />
        {/* Right leg */}
        <rect x="100" y="165" width="25" height="90" fill="currentColor" opacity="0.6" />
        {/* Base/Pedestal */}
        <rect x="50" y="255" width="100" height="30" fill="currentColor" opacity="0.8" />
        {/* Dithering pattern overlay */}
        <defs>
          <pattern id="dither" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="2" height="2" fill="currentColor" opacity="0.1" />
            <rect x="2" y="2" width="2" height="2" fill="currentColor" opacity="0.1" />
          </pattern>
        </defs>
        <rect width="200" height="300" fill="url(#dither)" opacity="0.3" />
      </svg>
    </div>
  );
}

