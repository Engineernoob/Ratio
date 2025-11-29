# Mobile Integration Guide

This guide shows how to integrate the mobile components into your pages.

## Setup

1. Ensure you have the mobile components in `components/mobile/`
2. Import the theme context and mobile hooks
3. Wrap your app with `ThemeProvider`

## Page Structure

Each mobile page should follow this structure:

```tsx
"use client";

import { BottomNav } from "@/components/mobile/BottomNav";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { useTheme } from "@/context/ThemeContext";

export default function MobilePage() {
  const { currentTheme } = useTheme();

  return (
    <div
      className="min-h-screen pb-20"
      style={{ background: currentTheme.background }}
    >
      <MobileHeader title="Page Title" />

      {/* Page content */}

      <BottomNav />
    </div>
  );
}
```

## Component Usage

### BottomNav

Persistent bottom navigation - add to every page:

```tsx
<BottomNav />
```

### MobileCard

Touch-optimized cards:

```tsx
<MobileCard variant="elevated" onClick={handleClick}>
  <h3>Card Title</h3>
  <p>Card content</p>
</MobileCard>
```

### SwipeCardStack

Tinder-like swipeable cards:

```tsx
<SwipeCardStack
  items={items}
  renderCard={(item) => <div>{item.content}</div>}
  onSwipeLeft={(item) => handleForgot(item)}
  onSwipeRight={(item) => handleEasy(item)}
  onTap={(item) => handleReveal(item)}
/>
```

### SlideOver

Slide-over panel:

```tsx
<SlideOver
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Panel Title"
  side="right" // or "left" or "bottom"
>
  <div>Content</div>
</SlideOver>
```

### BottomSheet

Draggable bottom sheet:

```tsx
<BottomSheet
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Sheet Title"
  snapPoints={[50, 90]}
>
  <div>Content</div>
</BottomSheet>
```

### FullScreenModal

Full-screen modal:

```tsx
<FullScreenModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Title"
>
  <div>Content</div>
</FullScreenModal>
```

## Page-Specific Implementations

### Oikos

- Use accordions for LECTIO/RITUAL/MEMORIA
- Feed items as MobileCard
- Micro-tests in BottomSheet

### Bibliotheca

- Vertical scroll shelf
- Book cards with parallax tilt (framer-motion)
- Chapters open in SlideOver

### Reader

- Full-screen reading mode
- Pagination + vertical scroll
- Long-press for highlights
- Toolbar hides on scroll
- AI actions in BottomSheet

### Memoria

- SwipeCardStack for card review
- Left swipe = Forgot
- Right swipe = Easy
- Tap to reveal answer

### Laboratorivm

- Full-screen puzzle UX
- Draggable items with snap-grid
- Multi-step logic vertically stacked

### Ars Rationis

- Full-screen input
- Simplified 2D nodes
- Tap node → FullScreenModal

### Scholarivm

- Swipeable mastery cards
- Graphs as sparklines
- Centered flame animation

## Performance Optimization

1. Use `transform: translateZ(0)` for GPU acceleration
2. Reduce blur on low-end devices
3. Lazy load images
4. Use `will-change` sparingly

## PWA Setup

1. Add manifest.json to public/
2. Register service worker in your app
3. Cache books and memoria data offline

```tsx
// Register service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
}
```

## Theme Integration

All components automatically adapt to the current theme:

- Colors use `currentTheme.accent`
- Backgrounds use `currentTheme.background`
- Borders and shadows adapt to theme

Use `useTheme()` hook to access theme:

```tsx
const { currentTheme, setTheme } = useTheme();
```
