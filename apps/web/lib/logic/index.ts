export * from "./types";
export * from "./parser";
// Export client-safe fallacy detection (doesn't use fs)
export { detectFallacies } from "./fallacies-client";
// Note: loadFallacies is server-only and should be imported directly from ./fallacies
export * from "./validity";
export * from "./mapping";
