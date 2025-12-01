"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { FogPanel } from "./core/FogPanel";
import { EngravedStatue } from "./core/EngravedStatue";

interface BookPlateProps {
  title: string;
  author: string;
  slug: string;
  imageSrc?: string;
  year?: number;
  className?: string;
}

export function BookPlate({
  title,
  author,
  slug,
  imageSrc,
  year,
  className,
}: BookPlateProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/bibliotheca/${slug}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn("relative cursor-pointer group", className)}
      onClick={handleClick}
    >
      <FogPanel className="card-padding" hover>
        {/* Miniature EngravedStatue thumbnail */}
        {imageSrc && (
          <div className="mb-4 opacity-60">
            <EngravedStatue
              imageSrc={imageSrc}
              alt={title}
              size="sm"
              className="w-full"
              vignette
            />
          </div>
        )}

        {/* Content */}
        <div className="relative z-10">
          {/* Title - Serif */}
          <h3 className="font-serif text-2xl font-semibold engraved engrave mb-2 group-hover:text-accent transition-colors">
            {title}
          </h3>

          {/* Author & Year - Mono */}
          <div className="font-mono text-xs text-muted-foreground mb-4">
            {author}
            {year && (
              <span className="ml-2">
                {year > 0 ? year : Math.abs(year) + " BCE"}
              </span>
            )}
          </div>

          {/* Decorative line */}
          <div className="border-t border-border mb-4" />

          {/* Hover indicator */}
          <div className="font-mono text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            Click to open →
          </div>
        </div>
      </FogPanel>
    </motion.div>
  );
}
