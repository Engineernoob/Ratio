"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { isOnline } from "@/lib/supabase/offline";

type SyncStatus = "syncing" | "synced" | "offline" | "error";

interface SyncStatusProps {
  className?: string;
}

export function SyncStatus({ className = "" }: SyncStatusProps) {
  const [status, setStatus] = useState<SyncStatus>("synced");
  const [online, setOnline] = useState(true);

  useEffect(() => {
    // Check online status
    const updateOnlineStatus = () => {
      const isOn = isOnline();
      setOnline(isOn);
      if (!isOn) {
        setStatus("offline");
      }
    };

    updateOnlineStatus();
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  const statusConfig = {
    syncing: {
      label: "Syncing...",
      color: "rgba(100, 200, 255, 0.8)",
      icon: "⟳",
    },
    synced: {
      label: "Synced",
      color: "rgba(150, 255, 150, 0.8)",
      icon: "✓",
    },
    offline: {
      label: "Offline",
      color: "rgba(255, 150, 100, 0.8)",
      icon: "○",
    },
    error: {
      label: "Error",
      color: "rgba(255, 100, 100, 0.8)",
      icon: "✕",
    },
  };

  const config = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex items-center gap-2 ${className}`}
    >
      <motion.div
        animate={{
          rotate: status === "syncing" ? 360 : 0,
        }}
        transition={{
          duration: status === "syncing" ? 1 : 0,
          repeat: status === "syncing" ? Infinity : 0,
          ease: "linear",
        }}
        className="w-2 h-2 rounded-full"
        style={{
          background: config.color,
          boxShadow: `0 0 8px ${config.color}`,
        }}
      />
      <span
        className="font-mono text-xs uppercase"
        style={{ color: config.color }}
      >
        {config.label}
      </span>
    </motion.div>
  );
}
