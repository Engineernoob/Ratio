"use client";

import { ChapterItem } from "./ChapterItem";

export interface Chapter {
  id: string;
  chapterNumber: number;
  title: string;
  description?: string;
  microLessonsCount?: number;
  microLessonsTime?: string;
  microLessonsType?: string;
}

interface ChapterListProps {
  chapters: Chapter[];
  expandedChapterId?: string;
  onToggleChapter?: (chapterId: string) => void;
  className?: string;
}

export function ChapterList({
  chapters,
  expandedChapterId,
  onToggleChapter,
  className,
}: ChapterListProps) {
  return (
    <div className={className}>
      {chapters.map((chapter) => (
        <ChapterItem
          key={chapter.id}
          chapterNumber={chapter.chapterNumber}
          title={chapter.title}
          description={chapter.description}
          microLessonsCount={chapter.microLessonsCount}
          microLessonsTime={chapter.microLessonsTime}
          microLessonsType={chapter.microLessonsType}
          isExpanded={expandedChapterId === chapter.id}
          onToggle={() => onToggleChapter?.(chapter.id)}
        />
      ))}
    </div>
  );
}
