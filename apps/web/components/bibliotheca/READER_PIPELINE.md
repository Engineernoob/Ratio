# Bookshelf → Reader Pipeline

## Overview

Complete pipeline from bookshelf click to chapter reading, with manifest-based book loading and PDF syncing.

## Architecture

### 1. Book Manifest System

**Location:** `/data/books/{bookId}/book.json`

**Structure:**

```json
{
  "id": "meditations",
  "title": "Meditations",
  "author": "Marcus Aurelius",
  "pdf": "/pdfs/meditations.pdf", // Optional
  "chapters": [
    {
      "id": "chapter-1",
      "title": "Book I — Debts and Lessons",
      "file": "chapter-1.json",
      "pageStart": 1, // Optional: PDF page start
      "pageEnd": 20 // Optional: PDF page end
    }
  ],
  "bookSpine": {
    "x": 412,
    "y": 118,
    "width": 32,
    "height": 240
  }
}
```

### 2. Helper Functions (`lib/books.ts`)

- **`getBookManifest(bookId)`** - Loads and validates book manifest
- **`getChapter(bookId, fileName)`** - Loads chapter JSON content
- **`getAllBookIds()`** - Lists all available books

### 3. API Routes

**`/api/books/[bookId]?action=manifest`**

- Returns book manifest with chapters and metadata

**`/api/books/[bookId]?action=chapter&file={fileName}`**

- Returns chapter JSON content

### 4. Bookshelf Click Flow

1. User clicks book hotspot
2. `Bookshelf` component fetches manifest via API
3. Uses `manifest.bookSpine` for zoom animation
4. Navigates to `/reader?book={bookId}`

### 5. Reader Page (`/app/reader/page.tsx`)

- Loads manifest on mount
- Displays chapter sidebar
- Loads first chapter by default
- Handles chapter selection → loads chapter JSON

### 6. ChapterReader Component

**Features:**

- **PDF Viewer** (top half, if `pdf` exists)
- **Chapter Content** (bottom half)
  - Chapter title and summary
  - Micro-lessons with Q&A
- **Chapter Sidebar** (left)
  - Chapter list with navigation
  - Per-page notes
- **PDF Page Syncing**
  - `pageStart` → jumps to page on chapter select
  - `pageEnd` → limits navigation range
  - Page controls respect chapter boundaries

## Usage

### Adding a New Book

1. Create directory: `/data/books/{bookId}/`
2. Add `book.json` manifest
3. Add chapter JSON files (e.g., `chapter-1.json`)
4. Optionally add PDF to `/public/pdfs/`
5. Update `BOOK_COORDINATES` in `/app/bibliotheca/page.tsx`

### Chapter JSON Format

```json
{
  "chapter": 1,
  "chapter_title": "Debts and Lessons",
  "summary": "Chapter summary text...",
  "micro_lessons": [
    {
      "title": "Lesson Title",
      "core_idea": "Main idea...",
      "micro_test_q": "Question?",
      "micro_test_a": "Answer."
    }
  ]
}
```

## Styling

Uses monochrome neo-classical style:

- Background: `#0A0A0A`
- Text: `#C8B68D`
- Borders: `#312A1D`
- Sepia texture overlays
- Engraved serif typography

## Integration

- **MEMORIA**: Selected text excerpts saved via `useMemoriaQueue`
- **Audio**: Page flip sounds on navigation
- **Animations**: Framer Motion for smooth transitions
