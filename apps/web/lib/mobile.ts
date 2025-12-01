"use client";

import { useState, useEffect } from "react";

/**
 * Hook to detect mobile breakpoint (max-width: 768px)
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    // Set initial value
    setMatches(media.matches);

    // Create event listener
    const listener = (event: MediaQueryListEvent | MediaQueryList) => {
      if ("matches" in event) {
        setMatches(event.matches);
      }
    };

    // Modern browsers
    if (media.addEventListener) {
      media.addEventListener("change", listener as EventListener);
      return () => media.removeEventListener("change", listener as EventListener);
    } else {
      // Fallback for older browsers
      media.addListener(listener as (mql: MediaQueryList) => void);
      return () => media.removeListener(listener as (mql: MediaQueryList) => void);
    }
  }, [query]);

  return matches;
}

/**
 * Hook to detect if device is mobile (max-width: 768px)
 */
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 768px)");
}

/**
 * Hook to detect if device is tablet (768px - 1024px)
 */
export function useIsTablet(): boolean {
  return useMediaQuery("(min-width: 769px) and (max-width: 1024px)");
}

/**
 * Hook to detect if device is desktop (> 1024px)
 */
export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1025px)");
}

/**
 * Mobile breakpoint constant
 */
export const MOBILE_BREAKPOINT = 768;
export const TABLET_BREAKPOINT = 1024;
