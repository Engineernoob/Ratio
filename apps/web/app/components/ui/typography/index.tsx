import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TypographyProps {
  children: ReactNode;
  className?: string;
}

export function DisplayTitle({ children, className }: TypographyProps) {
  return (
    <h1
      className={cn(
        "font-serif text-5xl md:text-6xl lg:text-7xl tracking-[0.18em] text-white leading-[1.05]",
        className
      )}
    >
      {children}
    </h1>
  );
}

export function PageTitle({ children, className }: TypographyProps) {
  return (
    <h2
      className={cn(
        "font-serif text-3xl md:text-4xl lg:text-[2.8rem] text-[#f2f1ed] tracking-[0.12em] leading-tight",
        className
      )}
    >
      {children}
    </h2>
  );
}

export function PageSubtitle({ children, className }: TypographyProps) {
  return (
    <p
      className={cn(
        "uppercase tracking-[0.28em] text-xs md:text-sm text-neutral-500 font-mono",
        className
      )}
    >
      {children}
    </p>
  );
}

export function SectionTitle({ children, className }: TypographyProps) {
  return (
    <h3
      className={cn(
        "font-serif text-2xl md:text-[28px] text-[#e3e1dc] tracking-[0.08em]",
        className
      )}
    >
      {children}
    </h3>
  );
}

export function BodyText({ children, className }: TypographyProps) {
  return (
    <p
      className={cn(
        "font-sans text-base md:text-lg leading-[1.7] text-neutral-400",
        className
      )}
    >
      {children}
    </p>
  );
}

export function MicroText({ children, className }: TypographyProps) {
  return (
    <p
      className={cn(
        "font-mono text-[11px] uppercase tracking-[0.24em] text-neutral-500",
        className
      )}
    >
      {children}
    </p>
  );
}
