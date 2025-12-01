"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { ArchivvmItem } from "@/lib/archivvm/types";

interface ArchivvmItemProps {
  item: ArchivvmItem;
  onClick: () => void;
}

export function ArchivvmItem({ item, onClick }: ArchivvmItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const truncateText = (text?: string, maxLength = 120) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className="cursor-pointer"
      animate={{
        scale: isHovered ? 1.01 : 1,
        y: isHovered ? -2 : 0,
      }}
      transition={{ duration: 0.2 }}
    >
      <div className={`archiv-card ${isHovered ? "is-hovered" : ""}`}>
        {/* Hover Glow */}
        <motion.div
          className="archiv-card__glow"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />

        {/* Content */}
        <div className="relative z-10 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="archiv-card__title truncate">
                {item.title || item.summary || truncateText(item.text, 50)}
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="archiv-pill">{getTypeLabel(item.type)}</span>
                {item.page && <span className="archiv-card__meta">p.{item.page}</span>}
              </div>
            </div>
          </div>

          {/* Text Preview */}
          {(item.text || item.summary) && (
            <p className="archiv-card__body">
              {truncateText(item.text || item.summary, 90)}
            </p>
          )}

          {/* Metadata */}
          <div className="archiv-card__footer">
            <div className="archiv-card__meta">
              {item.bookId}
              {item.chapterId && ` • ${item.chapterId}`}
            </div>
            <div className="archiv-card__meta">{formatDate(item.createdAt)}</div>
          </div>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {item.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="archiv-tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
