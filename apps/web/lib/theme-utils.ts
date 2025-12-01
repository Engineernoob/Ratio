/**
 * Theme utility functions for consistent styling
 */

export function getAccentColor(opacity: number = 1): string {
  if (opacity === 1) {
    return "var(--accent)";
  }
  // For opacity, we need to use rgba with the accent color
  // This is a simplified version - in production, you'd parse the CSS variable
  return `color-mix(in srgb, var(--accent) ${opacity * 100}%, transparent)`;
}

export function getAccentWithOpacity(opacity: number): string {
  // Convert hex to rgba using CSS color-mix or return a style object
  return `rgba(var(--accent-rgb, 200, 182, 141), ${opacity})`;
}

/**
 * Get border color with opacity
 */
export function getBorderColor(opacity: number = 0.2): string {
  return `color-mix(in srgb, var(--accent) ${opacity * 100}%, transparent)`;
}

/**
 * Get background color with opacity
 */
export function getBackgroundColor(opacity: number = 0.1): string {
  return `color-mix(in srgb, var(--accent) ${opacity * 100}%, transparent)`;
}
