# Ratio Mobile

Mobile-optimized web app experience for Ratio learning platform.

## Features

- **Mobile-First Design**: Optimized for touch interactions and mobile screens
- **PWA Support**: Installable as a native app with offline capabilities
- **Theme Engine**: Full theme support with mobile-optimized rendering
- **Touch Gestures**: Swipe cards, bottom sheets, and slide-over panels
- **Performance Optimized**: GPU-accelerated animations, reduced blur for low-end devices

## Components

### Mobile Components (`components/mobile/`)

- `BottomNav.tsx` - Persistent bottom navigation bar
- `MobileCard.tsx` - Touch-optimized card component
- `SwipeCardStack.tsx` - Tinder-like swipeable card stack
- `SlideOver.tsx` - Slide-over panel from sides/bottom
- `BottomSheet.tsx` - Draggable bottom sheet with snap points
- `FullScreenModal.tsx` - Full-screen modal overlay
- `MobileHeader.tsx` - Mobile-optimized header with back button
- `MobileNavBar.tsx` - Top navigation bar for mobile

## Mobile Breakpoints

- Mobile: `max-width: 768px`
- Tablet: `769px - 1024px`
- Desktop: `min-width: 1025px`

Use `useIsMobile()`, `useIsTablet()`, or `useIsDesktop()` hooks from `lib/mobile.ts`.

## PWA

The app includes:

- `manifest.json` - App manifest for installation
- `sw.js` - Service worker for offline caching
- Offline support for books and memoria cards

## Pages

All pages are optimized for mobile with:

- Single-column layouts
- Touch-friendly interactions
- Mobile-specific components
- Optimized animations

## Performance

- GPU-accelerated transforms using `transform: translateZ(0)`
- Reduced blur effects on low-end devices
- Lazy loading for images and components
- Optimized bundle size
