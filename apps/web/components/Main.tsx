import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MainProps {
  children: ReactNode;
  className?: string;
}

export function Main({ children, className }: MainProps) {
  return (
    <main
      className={cn("flex-1 overflow-y-auto relative", className)}
      style={{
        position: "relative",
        zIndex: 1,
        background: "var(--background, #0A0A0A)",
        backdropFilter: `blur(var(--blur, 0px))`,
      }}
    >
      <div className="p-8 max-w-6xl mx-auto scroll-fade-top scroll-fade-bottom">
        {children}
      </div>
    </main>
  );
}
