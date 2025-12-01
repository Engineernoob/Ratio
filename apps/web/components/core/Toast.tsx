"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose?: () => void;
}

export function Toast({
  message,
  type = "info",
  duration = 3000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeStyles = {
    success: "border-[rgba(198,122,58,0.3)] bg-[rgba(198,122,58,0.1)]",
    error: "border-[rgba(255,0,0,0.3)] bg-[rgba(255,0,0,0.1)]",
    info: "border-border bg-card",
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "fixed top-24 right-8 z-50 rounded-lg border px-4 py-3 shadow-lg backdrop-blur-sm",
            type === "success" ? "font-serif text-sm" : "font-mono text-sm",
            typeStyles[type]
          )}
          style={
            type === "success"
              ? {
                  borderColor: "rgba(200, 182, 141, 0.3)",
                  background: "rgba(200, 182, 141, 0.1)",
                  color: "#C8B68D",
                }
              : undefined
          }
        >
          <div className="flex items-center gap-3">
            {type === "success" && <span style={{ color: "#C8B68D" }}>✓</span>}
            {type === "error" && <span className="text-destructive">✕</span>}
            <span>{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface ToastContainerProps {
  toasts: Array<{
    id: string;
    message: string;
    type?: "success" | "error" | "info";
  }>;
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-24 right-8 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => onRemove(toast.id)}
          />
        </div>
      ))}
    </div>
  );
}
