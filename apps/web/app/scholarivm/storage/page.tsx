"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TopNavBar } from "@/components/core/TopNavBar";
import { ScholarivmShell } from "@/components/Scholarivm/ScholarivmShell";
import { EngravedHeader } from "@/components/core/EngravedHeader";
import { Main } from "@/components/Main";
import { SyncStatus } from "@/components/Sync/SyncStatus";
import {
  getStorageStats,
  backupAllData,
  exportAllData,
} from "@/lib/storage/backup";
import { restoreAllData } from "@/lib/storage/restore";
import type { StorageStats } from "@/lib/storage/types";

export default function StoragePage() {
  const [stats, setStats] = useState<StorageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [backingUp, setBackingUp] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const { stats: loadedStats } = await getStorageStats();
      setStats(loadedStats);
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackup = async () => {
    setBackingUp(true);
    try {
      const { error } = await backupAllData();
      if (error) {
        alert(`Backup failed: ${error.message}`);
      } else {
        alert("Backup completed successfully!");
        await loadStats();
      }
    } catch (error) {
      alert(`Backup failed: ${error}`);
    } finally {
      setBackingUp(false);
    }
  };

  const handleRestore = async () => {
    if (!confirm("This will restore all data from cloud. Continue?")) {
      return;
    }

    setRestoring(true);
    try {
      const { results, error } = await restoreAllData();
      if (error) {
        alert(`Restore failed: ${error.message}`);
      } else {
        alert(
          `Restore completed!\n` +
            `Memoria: ${results.memoria}\n` +
            `Notes: ${results.notes}\n` +
            `Highlights: ${results.highlights}\n` +
            `Progress: ${results.progress}`
        );
        await loadStats();
      }
    } catch (error) {
      alert(`Restore failed: ${error}`);
    } finally {
      setRestoring(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const { blob, error } = await exportAllData();
      if (error || !blob) {
        alert(`Export failed: ${error?.message || "Unknown error"}`);
      } else {
        // Download file
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `ratio-export-${
          new Date().toISOString().split("T")[0]
        }.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      alert(`Export failed: ${error}`);
    } finally {
      setExporting(false);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <>
      <TopNavBar />
      <Main className="scroll-fade-top scroll-fade-bottom">
        <ScholarivmShell>
          <div className="relative z-10 min-h-screen p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-12"
              >
                <EngravedHeader level={1} delay={0.2}>
                  CLOUD STORAGE
                </EngravedHeader>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="font-mono text-sm mt-4"
                  style={{ color: "rgba(215, 196, 158, 0.6)" }}
                >
                  Manage your intellectual data across all devices
                </motion.p>
              </motion.div>

              {/* Sync Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mb-8 flex justify-center"
              >
                <SyncStatus />
              </motion.div>

              {/* Stats */}
              {loading ? (
                <div className="text-center py-12">
                  <div
                    className="font-mono text-sm"
                    style={{ color: "rgba(215, 196, 158, 0.6)" }}
                  >
                    Loading storage statistics...
                  </div>
                </div>
              ) : stats ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="space-y-6 mb-12"
                >
                  {/* Total Usage */}
                  <div
                    className="p-6 border rounded-sm"
                    style={{
                      borderColor: "rgba(215, 196, 158, 0.2)",
                      background: "rgba(10, 10, 10, 0.6)",
                    }}
                  >
                    <div
                      className="font-mono text-xs uppercase mb-2"
                      style={{ color: "rgba(215, 196, 158, 0.5)" }}
                    >
                      Total Cloud Usage
                    </div>
                    <div
                      className="font-serif text-3xl font-bold"
                      style={{ color: "#d7c49e" }}
                    >
                      {formatBytes(stats.totalSize)}
                    </div>
                  </div>

                  {/* Bucket Breakdown */}
                  <div
                    className="p-6 border rounded-sm"
                    style={{
                      borderColor: "rgba(215, 196, 158, 0.2)",
                      background: "rgba(10, 10, 10, 0.6)",
                    }}
                  >
                    <div
                      className="font-mono text-xs uppercase mb-4"
                      style={{ color: "rgba(215, 196, 158, 0.5)" }}
                    >
                      Storage by Bucket
                    </div>
                    <div className="space-y-3">
                      {Object.entries(stats.bucketSizes).map(
                        ([bucket, size]) => (
                          <div
                            key={bucket}
                            className="flex justify-between items-center"
                          >
                            <span
                              className="font-mono text-xs uppercase"
                              style={{ color: "rgba(215, 196, 158, 0.7)" }}
                            >
                              {bucket}
                            </span>
                            <div className="flex items-center gap-4">
                              <span
                                className="font-mono text-xs"
                                style={{ color: "rgba(215, 196, 158, 0.6)" }}
                              >
                                {
                                  stats.fileCounts[
                                    bucket as keyof typeof stats.fileCounts
                                  ]
                                }{" "}
                                files
                              </span>
                              <span
                                className="font-serif text-sm"
                                style={{ color: "#d7c49e" }}
                              >
                                {formatBytes(size)}
                              </span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Backup Info */}
                  <div
                    className="p-6 border rounded-sm"
                    style={{
                      borderColor: "rgba(215, 196, 158, 0.2)",
                      background: "rgba(10, 10, 10, 0.6)",
                    }}
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span
                          className="font-mono text-xs uppercase"
                          style={{ color: "rgba(215, 196, 158, 0.5)" }}
                        >
                          Last Backup
                        </span>
                        <span
                          className="font-mono text-xs"
                          style={{ color: "rgba(215, 196, 158, 0.7)" }}
                        >
                          {stats.lastBackup
                            ? new Date(stats.lastBackup).toLocaleString()
                            : "Never"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span
                          className="font-mono text-xs uppercase"
                          style={{ color: "rgba(215, 196, 158, 0.5)" }}
                        >
                          Last Sync
                        </span>
                        <span
                          className="font-mono text-xs"
                          style={{ color: "rgba(215, 196, 158, 0.7)" }}
                        >
                          {stats.lastSync
                            ? new Date(stats.lastSync).toLocaleString()
                            : "Never"}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : null}

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <motion.button
                  onClick={handleBackup}
                  disabled={backingUp}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-6 border rounded-sm font-mono text-xs uppercase disabled:opacity-50"
                  style={{
                    borderColor: "rgba(215, 196, 158, 0.3)",
                    background: "rgba(215, 196, 158, 0.05)",
                    color: "#d7c49e",
                  }}
                >
                  {backingUp ? "Backing Up..." : "Backup All Data"}
                </motion.button>

                <motion.button
                  onClick={handleRestore}
                  disabled={restoring}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-6 border rounded-sm font-mono text-xs uppercase disabled:opacity-50"
                  style={{
                    borderColor: "rgba(215, 196, 158, 0.3)",
                    background: "rgba(215, 196, 158, 0.05)",
                    color: "#d7c49e",
                  }}
                >
                  {restoring ? "Restoring..." : "Restore All Data"}
                </motion.button>

                <motion.button
                  onClick={handleExport}
                  disabled={exporting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-6 border rounded-sm font-mono text-xs uppercase disabled:opacity-50"
                  style={{
                    borderColor: "rgba(215, 196, 158, 0.3)",
                    background: "rgba(215, 196, 158, 0.05)",
                    color: "#d7c49e",
                  }}
                >
                  {exporting ? "Exporting..." : "Export All Data"}
                </motion.button>
              </motion.div>
            </div>
          </div>
        </ScholarivmShell>
      </Main>
    </>
  );
}
