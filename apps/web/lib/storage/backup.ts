/**
 * Storage Backup Utilities
 * Handles backing up user data to cloud storage
 */

import { uploadJSON, uploadFile, listFiles } from "./upload";
import { getCurrentUser } from "@/lib/supabase/auth";
import { loadUserData } from "@/lib/supabase/sync";
import type { BackupManifest, StorageStats } from "./types";

/**
 * Backup memoria data
 */
export async function backupMemoria(): Promise<{ error: Error | null }> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: new Error("Not authenticated") };
  }

  try {
    // Load memoria data
    const { memoria } = await loadUserData();

    // Upload to userdata bucket
    const result = await uploadJSON("userdata", "memoria.json", memoria);

    return { error: result.error || null };
  } catch (error) {
    return {
      error: error instanceof Error ? error : new Error("Backup failed"),
    };
  }
}

/**
 * Backup all user data
 */
export async function backupAllData(): Promise<{
  manifest: BackupManifest | null;
  error: Error | null;
}> {
  const user = await getCurrentUser();
  if (!user) {
    return { manifest: null, error: new Error("Not authenticated") };
  }

  try {
    const timestamp = new Date().toISOString();
    const files: BackupManifest["files"] = [];

    // Backup memoria
    const memoriaResult = await backupMemoria();
    if (!memoriaResult.error) {
      files.push({
        bucket: "userdata",
        path: "memoria.json",
        size: 0, // Will be calculated
        type: "application/json",
      });
    }

    // Backup notes
    const { notes } = await loadUserData();
    const notesResult = await uploadJSON("userdata", "notes.json", notes);
    if (!notesResult.error) {
      files.push({
        bucket: "userdata",
        path: "notes.json",
        size: 0,
        type: "application/json",
      });
    }

    // Backup highlights
    const { highlights } = await loadUserData();
    const highlightsResult = await uploadJSON(
      "userdata",
      "highlights.json",
      highlights
    );
    if (!highlightsResult.error) {
      files.push({
        bucket: "userdata",
        path: "highlights.json",
        size: 0,
        type: "application/json",
      });
    }

    // Backup progress
    const { progress } = await loadUserData();
    const progressResult = await uploadJSON(
      "userdata",
      "progress.json",
      progress
    );
    if (!progressResult.error) {
      files.push({
        bucket: "userdata",
        path: "progress.json",
        size: 0,
        type: "application/json",
      });
    }

    // Create manifest
    const manifest: BackupManifest = {
      version: "1.0.0",
      timestamp,
      user_id: user.id,
      files,
    };

    // Upload manifest
    await uploadJSON("userdata", "backup-manifest.json", manifest);

    return { manifest, error: null };
  } catch (error) {
    return {
      manifest: null,
      error: error instanceof Error ? error : new Error("Backup failed"),
    };
  }
}

/**
 * Get storage statistics
 */
export async function getStorageStats(): Promise<{
  stats: StorageStats | null;
  error: Error | null;
}> {
  const user = await getCurrentUser();
  if (!user) {
    return { stats: null, error: new Error("Not authenticated") };
  }

  try {
    const buckets: Array<{ name: string; bucket: any }> = [
      { name: "books", bucket: "books" },
      { name: "notes", bucket: "notes" },
      { name: "highlights", bucket: "highlights" },
      { name: "maps", bucket: "maps" },
      { name: "puzzles", bucket: "puzzles" },
      { name: "userdata", bucket: "userdata" },
    ];

    const bucketSizes: Record<string, number> = {};
    const fileCounts: Record<string, number> = {};

    let totalSize = 0;

    for (const { name, bucket } of buckets) {
      const { files } = await listFiles(bucket as any);
      const size = files.reduce(
        (sum, file) => sum + (file.metadata?.size || 0),
        0
      );
      bucketSizes[name] = size;
      fileCounts[name] = files.length;
      totalSize += size;
    }

    // Get last backup time from manifest
    let lastBackup: string | null = null;
    try {
      const { downloadJSON } = await import("./download");
      const { data: manifestData } = await downloadJSON(
        "userdata",
        "backup-manifest.json"
      );
      lastBackup = manifestData?.timestamp || null;
    } catch (error) {
      // Manifest might not exist yet
    }

    const stats: StorageStats = {
      totalSize,
      bucketSizes: bucketSizes as any,
      fileCounts: fileCounts as any,
      lastBackup,
      lastSync: new Date().toISOString(),
    };

    return { stats, error: null };
  } catch (error) {
    return {
      stats: null,
      error: error instanceof Error ? error : new Error("Failed to get stats"),
    };
  }
}

/**
 * Export all data as ZIP (client-side)
 */
export async function exportAllData(): Promise<{
  blob: Blob | null;
  error: Error | null;
}> {
  const user = await getCurrentUser();
  if (!user) {
    return { blob: null, error: new Error("Not authenticated") };
  }

  try {
    // This would use a library like JSZip in production
    // For now, return a JSON file with all data
    const { memoria, notes, highlights, progress } = await loadUserData();

    const exportData = {
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      user_id: user.id,
      data: {
        memoria,
        notes,
        highlights,
        progress,
      },
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });

    return { blob, error: null };
  } catch (error) {
    return {
      blob: null,
      error: error instanceof Error ? error : new Error("Export failed"),
    };
  }
}
