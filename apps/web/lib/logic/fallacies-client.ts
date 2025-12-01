/**
 * Client-safe fallacy detection functions
 * These functions don't use Node.js fs module
 */

import type { Fallacy } from "./types";

/**
 * Get regex patterns for fallacy detection
 */
function getFallacyPatterns(fallacyName: string): string[] {
  const patterns: Record<string, string[]> = {
    "Ad Hominem": [
      "you can't trust",
      "because (he|she|they) (is|are)",
      "attacking the person",
    ],
    "Straw Man": ["they want to", "misrepresent", "distorted version"],
    "False Dilemma": ["either.*or", "only two options", "with us or against"],
    "Appeal to Popularity": [
      "everyone knows",
      "everyone believes",
      "most people",
    ],
    "Slippery Slope": ["if.*then.*next", "inevitably lead", "chain of events"],
  };

  return patterns[fallacyName] || [];
}

/**
 * Detect fallacies in argument text
 * This is client-safe and doesn't use fs
 */
export function detectFallacies(text: string, fallacies: Fallacy[]): Fallacy[] {
  const detected: Fallacy[] = [];
  const lowerText = text.toLowerCase();

  for (const fallacy of fallacies) {
    const patterns = getFallacyPatterns(fallacy.name);
    const matches = patterns.some((pattern) =>
      new RegExp(pattern, "i").test(lowerText)
    );

    if (matches) {
      detected.push(fallacy);
    }
  }

  return detected;
}
