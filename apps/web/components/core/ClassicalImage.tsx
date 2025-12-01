"use client";

import { DitherImage } from "./DitherImage";
import { ClassicalFigure } from "./ClassicalFigure";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface ClassicalImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  fallback?: boolean;
}

export function ClassicalImage({ 
  src, 
  alt, 
  className,
  priority = false,
  fallback = true
}: ClassicalImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if image exists
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setIsLoading(false);
      setHasError(false);
    };
    img.onerror = () => {
      setIsLoading(false);
      setHasError(true);
    };
    img.src = src;
  }, [src]);

  // If image fails to load and fallback is enabled, show SVG figure
  if (hasError && fallback) {
    return (
      <div className={cn("w-full flex items-center justify-center", className)}>
        <ClassicalFigure />
      </div>
    );
  }

  // Show loading state or image
  if (isLoading && !hasError) {
    return (
      <div className={cn("w-full flex items-center justify-center", className)}>
        <div className="border-[1.5px] border-border max-w-xs w-[300px] h-[400px] flex items-center justify-center">
          <div className="font-mono text-xs text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full flex items-center justify-center", className)}>
      <div className="border-[1.5px] border-border max-w-xs">
        <DitherImage
          src={src}
          alt={alt}
          width={300}
          height={400}
          className="border-0"
          priority={priority}
        />
      </div>
    </div>
  );
}
