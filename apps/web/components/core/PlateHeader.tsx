import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PlateHeaderProps {
  title: string;
  subtitle?: string;
  plateNumber?: string;
  className?: string;
  children?: ReactNode;
}

export function PlateHeader({ 
  title, 
  subtitle, 
  plateNumber,
  className,
  children 
}: PlateHeaderProps) {
  return (
    <div className={cn("border-b border-border pb-4 mb-6", className)}>
      {plateNumber && (
        <div className="text-xs text-muted-foreground font-mono mb-2">
          PLATE {plateNumber}
        </div>
      )}
      <h1 className="font-serif text-3xl font-bold engraved mb-2">{title}</h1>
      {subtitle && (
        <p className="font-mono text-sm text-muted-foreground">{subtitle}</p>
      )}
      {children}
    </div>
  );
}

