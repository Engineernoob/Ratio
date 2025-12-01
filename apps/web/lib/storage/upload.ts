/**
 * Storage Upload Pipeline
 * Handles file uploads to Supabase Storage
 */

import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { getCurrentUser } from "@/lib/supabase/auth";
import type { StorageBucket, UploadResult } from "./types";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_PDF_TYPES = ["application/pdf"];
const ALLOWED_JSON_TYPES = ["application/json", "text/json"];

/**
 * Initialize storage buckets (should be called once during setup)
 */
export async function initializeBuckets(): Promise<{ error: Error | null }> {
  if (!isSupabaseConfigured()) {
    return { error: new Error("Supabase not configured") };
  }

  const buckets: StorageBucket[] = [
    "books",
    "notes",
    "highlights",
    "maps",
    "puzzles",
    "userdata",
  ];

  const errors: Error[] = [];

  for (const bucket of buckets) {
    try {
      // Check if bucket exists
      const { data, error } = await supabase.storage.from(bucket).list("", {
        limit: 1,
      });

      if (error && error.message.includes("not found")) {
        // Create bucket (this requires admin access, so might fail)
        console.warn(
          `Bucket ${bucket} does not exist. Please create it in Supabase dashboard.`
        );
      }
    } catch (error) {
      errors.push(
        error instanceof Error
          ? error
          : new Error(`Failed to initialize ${bucket}`)
      );
    }
  }

  return {
    error: errors.length > 0 ? errors[0] : null,
  };
}

/**
 * Upload file to storage
 */
export async function uploadFile(
  bucket: StorageBucket,
  path: string,
  file: File | Blob,
  options?: {
    contentType?: string;
    cacheControl?: string;
    upsert?: boolean;
  }
): Promise<UploadResult> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      path: "",
      url: "",
      size: 0,
      error: new Error("Not authenticated"),
    };
  }

  if (!isSupabaseConfigured()) {
    return {
      path: "",
      url: "",
      size: 0,
      error: new Error("Supabase not configured"),
    };
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      path: "",
      url: "",
      size: file.size,
      error: new Error(
        `File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`
      ),
    };
  }

  // Validate file type for PDFs
  if (bucket === "books" && file instanceof File) {
    if (!ALLOWED_PDF_TYPES.includes(file.type)) {
      return {
        path: "",
        url: "",
        size: file.size,
        error: new Error("Only PDF files are allowed for books"),
      };
    }
  }

  try {
    // Add user ID to path for organization
    const userPath = `${user.id}/${path}`;

    // Upload file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(userPath, file, {
        contentType:
          options?.contentType || file.type || "application/octet-stream",
        cacheControl: options?.cacheControl || "3600",
        upsert: options?.upsert || false,
      });

    if (error) {
      return {
        path: "",
        url: "",
        size: file.size,
        error,
      };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(userPath);

    return {
      path: data.path,
      url: publicUrl,
      size: file.size,
    };
  } catch (error) {
    return {
      path: "",
      url: "",
      size: file.size,
      error: error instanceof Error ? error : new Error("Upload failed"),
    };
  }
}

/**
 * Upload JSON data
 */
export async function uploadJSON(
  bucket: StorageBucket,
  path: string,
  data: any
): Promise<UploadResult> {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });

  return uploadFile(bucket, path, blob, {
    contentType: "application/json",
  });
}

/**
 * Upload PDF file
 */
export async function uploadPDF(
  path: string,
  file: File
): Promise<UploadResult> {
  return uploadFile("books", path, file, {
    contentType: "application/pdf",
  });
}

/**
 * Delete file from storage
 */
export async function deleteFile(
  bucket: StorageBucket,
  path: string
): Promise<{ error: Error | null }> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: new Error("Not authenticated") };
  }

  if (!isSupabaseConfigured()) {
    return { error: new Error("Supabase not configured") };
  }

  try {
    const userPath = `${user.id}/${path}`;
    const { error } = await supabase.storage.from(bucket).remove([userPath]);

    return { error: error || null };
  } catch (error) {
    return {
      error: error instanceof Error ? error : new Error("Delete failed"),
    };
  }
}

/**
 * List files in bucket
 */
export async function listFiles(
  bucket: StorageBucket,
  folder?: string
): Promise<{ files: any[]; error: Error | null }> {
  const user = await getCurrentUser();
  if (!user) {
    return { files: [], error: new Error("Not authenticated") };
  }

  if (!isSupabaseConfigured()) {
    return { files: [], error: new Error("Supabase not configured") };
  }

  try {
    const path = folder ? `${user.id}/${folder}` : user.id;
    const { data, error } = await supabase.storage.from(bucket).list(path);

    if (error) {
      return { files: [], error };
    }

    return { files: data || [], error: null };
  } catch (error) {
    return {
      files: [],
      error: error instanceof Error ? error : new Error("List failed"),
    };
  }
}

/**
 * Get file URL
 */
export function getFileURL(bucket: StorageBucket, path: string): string {
  const userPath = path.startsWith("/") ? path.substring(1) : path;
  const { data } = supabase.storage.from(bucket).getPublicUrl(userPath);
  return data.publicUrl;
}
