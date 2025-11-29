"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface MobileHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  actions?: ReactNode;
}

export function MobileHeader({
  title,
  subtitle,
  onBack,
  actions,
}: MobileHeaderProps) {
  const { currentTheme } = useTheme();
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-40 border-b backdrop-blur-md"
      style={{
        background: `rgba(${
          currentTheme.background === "#000000" ? "0,0,0" : "10,10,10"
        }, 0.95)`,
        borderColor: `${currentTheme.accent}33`,
      }}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3 flex-1">
          {onBack !== false && (
            <button
              onClick={handleBack}
              className="p-2 rounded-full hover:bg-opacity-20 transition-colors"
              style={{
                color: currentTheme.accent,
                background: `${currentTheme.accent}10`,
              }}
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div className="flex-1">
            <h1
              className="font-serif text-lg"
              style={{ color: currentTheme.accent }}
            >
              {title}
            </h1>
            {subtitle && (
              <p
                className="font-mono text-xs mt-1"
                style={{ color: `${currentTheme.accent}99` }}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </motion.header>
  );
}
