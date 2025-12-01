# Core UI Components

Reusable UI components following Ratio OS's neo-classical brutalist design system.

## Components

### StoneTablet

Engraved stone tablet with dithering and texture overlays. Perfect for section headers and content blocks.

```tsx
<StoneTablet title="LECTIO" subtitle="Reading & Study" delay={0.4}>
  {content}
</StoneTablet>
```

### ScrollCard

Parchment-style scroll card with unrolling animation. Used for feed items and content lists.

```tsx
<ScrollCard delay={0.2}>{content}</ScrollCard>
```

### WaxSealButton

Wax seal-styled button with radial glow and dithering. Perfect for important actions.

```tsx
<WaxSealButton onClick={handleClick}>Reveal Answer</WaxSealButton>
```

### FogPanel

Floating panel with fog gradient and dithering overlay. Base component for cards and containers.

```tsx
<FogPanel hover={true} delay={0.1}>
  {content}
</FogPanel>
```

### FogCard

Card variant with subtle fog effects and rounded borders. Used in bibliotheca components.

```tsx
<FogCard hover={true} delay={0.2}>
  {content}
</FogCard>
```

### EngravedHeader

Serif header with engraved text effect and breathing glow. Supports h1-h6 levels.

```tsx
<EngravedHeader level={1} delay={0.2}>
  SALVE, SCHOLAR
</EngravedHeader>
```

### FloatingSigil

Circular floating sigil with gentle animation. Perfect for icons and decorative elements.

```tsx
<FloatingSigil size="md" delay={0.3}>
  ⚖
</FloatingSigil>
```

### ParchmentOverlay

Parchment-textured overlay with ink fade effect. Wraps content in ancient scroll aesthetic.

```tsx
<ParchmentOverlay delay={0.1}>{content}</ParchmentOverlay>
```

### LogicNode

Draggable logic node for knowledge graphs. Includes dithering and fog effects.

```tsx
<LogicNode title="Concept" draggable={true} position={{ x: 100, y: 200 }}>
  {content}
</LogicNode>
```

### LedgerList

Ancient ledger-style list with engraved labels. Perfect for data tables and records.

```tsx
<LedgerList
  items={[
    { id: "1", label: "Item", value: "Value" },
    { id: "2", label: "Item", value: "Value" },
  ]}
  showDividers={true}
/>
```

## Design Tokens

All components use:

- **Colors**: `obsidian`, `gravestone`, `marble`, `ivory`, `parchment`, `bronze`, `wax`, `fogwhite`
- **Typography**: Serif for headers, mono for body
- **Effects**: Dithering, fog gradients, stone textures, parchment textures
- **Animations**: Framer Motion with consistent timing

## Usage

```tsx
import {
  StoneTablet,
  ScrollCard,
  WaxSealButton,
  FogPanel,
  FogCard,
} from "@/components/core";
```

For a complete list of all components, see [COMPONENTS_LIST.md](./COMPONENTS_LIST.md).
