/**
 * Storage Download Pipeline
 * Handles file downloads from Supabase Storage with caching
 */

import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { getCurrentUser } from "@/lib/supabase/auth";
import type { StorageBucket, DownloadResult } from "./types";

const CACHE_PREFIX = "ratio_storage_cache_";
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

interface CacheEntry {
  data: string;
  timestamp: number;
  type: string;
}

/**
 * Get cached data
 */
function getCachedData(key: string): CacheEntry | null {
  if (typeof window === "undefined") return null;

  try {
    const cached = localStorage.getItem(CACHE_PREFIX + key);
    if (!cached) return null;

    const entry: CacheEntry = JSON.parse(cached);
    const now = Date.now();

    // Check if expired
    if (now - entry.timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }

    return entry;
  } catch (error) {
    console.error("Error reading cache:", error);
    return null;
  }
}

/**
 * Set cached data
 */
function setCachedData(key: string, data: string, type: string): void {
  if (typeof window === "undefined") return;

  try {
    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
      type,
    };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
  } catch (error) {
    console.error("Error writing cache:", error);
  }
}

/**
 * Download file from storage
 */
export async function downloadFile(
  bucket: StorageBucket,
  path: string,
  options?: {
    useCache?: boolean;
    asBlob?: boolean;
  }
): Promise<DownloadResult> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      data: null,
      url: "",
      cached: false,
      error: new Error("Not authenticated"),
    };
  }

  if (!isSupabaseConfigured()) {
    return {
      data: null,
      url: "",
      cached: false,
      error: new Error("Supabase not configured"),
    };
  }

  const cacheKey = `${bucket}/${path}`;
  const useCache = options?.useCache !== false;

  // Check cache first
  if (useCache) {
    const cached = getCachedData(cacheKey);
    if (cached) {
      return {
        data: cached.data,
        url: getFileURL(bucket, path),
        cached: true,
      };
    }
  }

  try {
    const userPath = `${user.id}/${path}`;
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(userPath);

    if (error) {
      // Try to get from cache as fallback
      const cached = getCachedData(cacheKey);
      if (cached) {
        return {
          data: cached.data,
          url: getFileURL(bucket, path),
          cached: true,
        };
      }

      return {
        data: null,
        url: "",
        cached: false,
        error,
      };
    }

    // Convert to appropriate format
    let result: string | Blob;
    if (options?.asBlob) {
      result = data;
    } else {
      const text = await data.text();
      result = text;

      // Cache the result
      if (useCache) {
        setCachedData(cacheKey, text, data.type);
      }
    }

    return {
      data: result,
      url: getFileURL(bucket, path),
      cached: false,
    };
  } catch (error) {
    // Try cache as fallback
    const cached = getCachedData(cacheKey);
    if (cached) {
      return {
        data: cached.data,
        url: getFileURL(bucket, path),
        cached: true,
      };
    }

    return {
      data: null,
      url: "",
      cached: false,
      error: error instanceof Error ? error : new Error("Download failed"),
    };
  }
}

/**
 * Download JSON file
 */
export async function downloadJSON(
  bucket: StorageBucket,
  path: string
): Promise<{ data: any | null; error: Error | null }> {
  const result = await downloadFile(bucket, path, { useCache: true });

  if (result.error) {
    return { data: null, error: result.error };
  }

  if (!result.data || typeof result.data !== "string") {
    return { data: null, error: new Error("Invalid JSON data") };
  }

  try {
    const parsed = JSON.parse(result.data);
    return { data: parsed, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error("Failed to parse JSON"),
    };
  }
}

/**
 * Download PDF file
 */
export async function downloadPDF(
  path: string
): Promise<{ blob: Blob | null; url: string; error: Error | null }> {
  const result = await downloadFile("books", path, {
    useCache: true,
    asBlob: true,
  });

  if (result.error) {
    return { blob: null, url: "", error: result.error };
  }

  if (!(result.data instanceof Blob)) {
    return { blob: null, url: "", error: new Error("Invalid PDF data") };
  }

  return {
    blob: result.data,
    url: result.url,
    error: null,
  };
}

/**
 * Get file URL (public URL)
 */
export function getFileURL(bucket: StorageBucket, path: string): string {
  if (!isSupabaseConfigured()) {
    return "";
  }

  const userPath = path.startsWith("/") ? path.substring(1) : path;
  const { data } = supabase.storage.from(bucket).getPublicUrl(userPath);
  return data.publicUrl;
}

/**
 * Clear cache
 */
export function clearCache(bucket?: StorageBucket, path?: string): void {
  if (typeof window === "undefined") return;

  if (bucket && path) {
    const key = `${bucket}/${path}`;
    localStorage.removeItem(CACHE_PREFIX + key);
  } else if (bucket) {
    // Clear all cache for bucket
    const prefix = CACHE_PREFIX + bucket + "/";
    Object.keys(localStorage)
      .filter((key) => key.startsWith(prefix))
      .forEach((key) => localStorage.removeItem(key));
  } else {
    // Clear all cache
    Object.keys(localStorage)
      .filter((key) => key.startsWith(CACHE_PREFIX))
      .forEach((key) => localStorage.removeItem(key));
  }
}
