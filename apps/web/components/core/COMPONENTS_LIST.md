# Complete Components List

All components from your requirements have been created in `/components/core/`.

## ✅ 1. Layout Components

- **SectionHeader** - Engraved serif header with halo glow and optional Latin subtitle
- **BreadcrumbBar** - Location bar (e.g., "OIKOS — DAILY FEED")
- **DividerBar** - Dotted lines, thin, faint gold dividers
- **Main** - Scrollable content area with fade gradients (in root `/components/`)
- **ContextPanel** - Right-side ledger panel (already existed, moved to core)

## ✅ 2. Card Components

- **FogPanel** - Core design system component (graphite-gray fog texture, engraved edges)
- **ScrollPreviewCard** - Used in Bibliotheca + Archivvm (title, author, summary, tags, "Open Scroll" button)
- **MicroLessonCard** - Contains title, concept summary, time estimate, Begin/Continue CTA
- **ExercisePanel** - Three-step structure (Step I: Concept, Step II: Exemplum, Step III: Responsum)
- **ReviewCard** - Includes item type, memory strength, "Review" button

## ✅ 3. Button / Action Components

- **OrangeAction** - Accent warm-gold button (already existed, moved to core)
- **CircularSealButton** - Circular seal buttons with symbols (→, ✓, ⌘, •)
- **WaxSealButton** - Wax seal styled button (already existed)
- **PillTag** - Pill tags for categories (LECTIO, RITUAL, MEMORIA, EXERCITIA, THEATRVM, LOGICA, PARADOXUM, PUZZLE)

## ✅ 4. Interactive Components

- **ScrollUnroll** - Bibliotheca's signature scroll unroll animation (cylindrical reveal, unfolding content, fog fade)
- **ExpandableText** - Used in feed items, summaries, logic puzzles (already existed, moved to core)
- **ModalPanel** - Appears for deep book view, micro-test, logic breakdown, scroll reveal
- **LogicBuilderBlock** - Used in Ars Rationis (Claim, Premise, Fallacy, Syllogism, Counterexample - all styled like engraved stone tablets)

## ✅ 5. Ledger Components (Right Column)

- **DailyLedger** - Oikos: texts, rituals, reviews, today's status
- **LibraryLedger** - Bibliotheca: scrolls, last opened, study streak, "Continue Lectio"
- **TrainingLedger** - Laboratorium: drills, completed/pending, time spent, memory links active
- **MemoryStats** - Memoria: items due, concepts learned, review streak
- **ArchiveStats** - Archivvm: total scrolls, micro-lessons indexed, strongest/weakest concepts
- **LogicLedger** - Scholarium/Ars Rationis: completed syllogisms, open dilemmas, active arguments
- **LedgerList** - Base component for all ledger displays (already existed)

## ✅ 6. System UI Components

- **TopNavBar** - Global navbar with flat engraved tabs (in `core/`)
- **BreadcrumbBar** - Location bar component
- **DividerBar** - Dotted divider lines
- ⚠️ **SideNav** - Referenced in RootLayoutWrapper but file not found

## ✅ 7. Feedback Components

- **Toast** - Toast notifications (already existed, moved to core)
- **KnowledgeStreakIndicator** - Glowing dots or progress bars for knowledge streaks
- **SuccessSealAnimation** - Stamped gold-circle seal appearing for completed lessons, reviewed items, stored scrolls

## Additional Components (Supporting)

- **EngravedHeader** - Serif header with engraved effect
- **StoneTablet** - Engraved stone tablet component
- **ScrollCard** - Parchment scroll card
- **FloatingSigil** - Circular floating sigil
- **ParchmentOverlay** - Parchment texture overlay
- **LogicNode** - Draggable logic node
- **EngravedStatue** - Engraved statue image component
- **DitherImage** - Dithered image component
- **ClassicalImage** - Classical image with fallback
- **ClassicalFigure** - SVG classical figure
- **PlateHeader** - Plate header component
- **MemoryGrid** - Memory retention grid
- **SkeletonLoader** - Loading skeleton

## Usage

All components can be imported from the barrel export:

```tsx
import {
  SectionHeader,
  ScrollPreviewCard,
  MicroLessonCard,
  ExercisePanel,
  ReviewCard,
  CircularSealButton,
  PillTag,
  ScrollUnroll,
  ModalPanel,
  LogicBuilderBlock,
  DailyLedger,
  LibraryLedger,
  TrainingLedger,
  MemoryStats,
  ArchiveStats,
  LogicLedger,
  BreadcrumbBar,
  DividerBar,
  KnowledgeStreakIndicator,
  SuccessSealAnimation,
  FogPanel,
  FogCard, // Card variant with different styling
  TopNavBar,
} from "@/components/core";
```

## Design System

All components follow the Ratio OS aesthetic:

- Monochrome color palette
- Dithering and grain textures
- Engraved serif typography
- Monospace body text
- Bronze/gold accents
- Fog gradients
- Framer Motion animations
- Responsive design
