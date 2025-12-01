import { cn } from "@/lib/utils";

interface PixelIconProps {
  name: string;
  className?: string;
}

// Simple pixel-style icons using Unicode/ASCII art
const iconMap: Record<string, string> = {
  home: "⌂",
  book: "☗",
  lab: "⚗",
  memory: "◉",
  archive: "☰",
  scholar: "☤",
  tool: "⚙",
};

export function PixelIcon({ name, className }: PixelIconProps) {
  const icon = iconMap[name] || "■";
  
  return (
    <span className={cn("inline-block font-mono text-lg leading-none", className)}>
      {icon}
    </span>
  );
}

