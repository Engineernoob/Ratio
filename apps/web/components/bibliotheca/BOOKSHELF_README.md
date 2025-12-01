# Interactive Bookshelf System

## Overview

The interactive bookshelf system provides an immersive, ancient-library style interface for browsing and reading books. It features pixel-perfect book hotspots, smooth animations, and a full-featured PDF reader.

## Components

### `<Bookshelf />`

Main container component that displays the bookshelf image and manages book hotspots.

**Props:**

- `books: BookData[]` - Array of book data with coordinates
- `shelfImagePath: string` - Path to the bookshelf background image
- `onBookClick?: (bookId: string) => void` - Callback when a book is clicked

### `<BookHotspot />`

Individual interactive book region overlay.

**Features:**

- Amber glow on hover (10% opacity)
- Smooth scale animation on hover
- Pull-out animation (12px) on click
- Camera zoom (scale 1 → 1.12) on click

### `<ChapterReader />`

Full-screen PDF reader with monastic styling.

**Features:**

- PDF viewer with page navigation
- Chapter list sidebar
- Note-taking system (per-page)
- Text selection and excerpt saving to MEMORIA
- AI Summary button (placeholder)
- Page flip sound effects
- Sepia textured background

### `<SealedScrollModal />`

Modal displayed when a book has no PDF assigned.

## Book Data Format

```typescript
interface BookData {
  id: string; // Unique identifier
  title?: string; // Display title
  pdf?: string; // Path to PDF file (optional)
  x: number; // X coordinate in pixels
  y: number; // Y coordinate in pixels
  width: number; // Width in pixels
  height: number; // Height in pixels
}
```

## Routing

- Bookshelf: `/bibliotheca`
- Reader: `/reader/[bookId]`

Clicking a book hotspot navigates to `/reader/[bookId]` with smooth animations.

## Adding Books

1. Add book data to `BOOK_COORDINATES` array in:

   - `/app/bibliotheca/page.tsx` (for bookshelf display)
   - `/app/reader/[bookId]/page.tsx` (for reader lookup)

2. Place PDF files in `/public/pdfs/` directory

3. Update coordinates to match your bookshelf image

## Audio

Page flip sound is generated using Web Audio API. To use a custom sound file:

1. Place `page-flip.mp3` in `/public/sounds/`
2. The system will automatically use it if available

## Styling

The system uses a monastic, amber-lit aesthetic:

- Background: `#0A0A0A`
- Text: `#C8B68D`
- Borders: `#312A1D`
- Hover glow: `rgba(200, 182, 141, 0.1)`

## Integration with MEMORIA

Selected text excerpts are automatically saved to the MEMORIA spaced repetition system via the `useMemoriaQueue` hook.
