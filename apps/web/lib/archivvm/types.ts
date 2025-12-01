export type ArchivvmItemType =
  | "highlight"
  | "note"
  | "summary"
  | "memoria"
  | "chapter";

export interface ArchivvmItem {
  id: string;
  type: ArchivvmItemType;
  bookId: string;
  chapterId?: string;
  page?: number;
  text?: string;
  summary?: string;
  microTests?: string[];
  createdAt: string;
  tags?: string[];
  // Additional metadata
  title?: string;
  content?: string;
  question?: string;
  answer?: string;
}
