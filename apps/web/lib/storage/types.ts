/**
 * Storage Types
 */

export type StorageBucket =
  | "books"
  | "notes"
  | "highlights"
  | "maps"
  | "puzzles"
  | "userdata";

export interface UploadResult {
  path: string;
  url: string;
  size: number;
  error?: Error;
}

export interface DownloadResult {
  data: Blob | string | null;
  url: string;
  cached: boolean;
  error?: Error;
}

export interface StorageStats {
  totalSize: number;
  bucketSizes: Record<StorageBucket, number>;
  fileCounts: Record<StorageBucket, number>;
  lastBackup: string | null;
  lastSync: string | null;
}

export interface BackupManifest {
  version: string;
  timestamp: string;
  user_id: string;
  files: Array<{
    bucket: StorageBucket;
    path: string;
    size: number;
    type: string;
  }>;
}
