# NeuroNest React Components — Icon System

Production-ready React + Tailwind components for the "Science of Auditory Neuromodulation" feature section.

## File Structure

```
react-components/
├── FeatureSection.jsx          ← Full section with 4 blocks (text left, icon right)
├── icon-animations.css         ← All keyframes, animation classes, and a11y overrides
└── icons/
    ├── index.js                ← Barrel exports
    ├── NeuralEntrainmentIcon.jsx
    ├── DeliveryMethodsIcon.jsx
    ├── EvidenceBasedIcon.jsx
    └── PersonalizedProtocolsIcon.jsx
```

## Quick Start

```jsx
// 1. Import the CSS (once, in your global styles or layout)
import './react-components/icon-animations.css';

// 2. Use the full section
import FeatureSection from './react-components/FeatureSection';

function App() {
  return <FeatureSection />;
}
```

Or use individual icons:

```jsx
import { NeuralEntrainmentIcon, DeliveryMethodsIcon } from './react-components/icons';

<NeuralEntrainmentIcon size={120} className="text-white" />
<DeliveryMethodsIcon size={80} className="text-gray-300" />
```

## Icon Props

| Prop        | Type     | Default | Description                |
|-------------|----------|---------|----------------------------|
| `size`      | `number` | `140`   | Width and height in pixels |
| `className` | `string` | `''`    | Additional CSS classes     |

All icons use `currentColor` for strokes, so they inherit your text color. The electric-blue accents use `#6366F1` (Indigo 500) directly for branded glow effects.

## Icon Concepts

| Icon | Visual | Animation |
|------|--------|-----------|
| **Neural Entrainment** | Anatomical brain outline with cortical folds | Indigo pulse nodes fire staggered across brain regions (6s) |
| **Delivery Methods** | 4 signal paths converging to central hub | Dashed lines flow toward center, hub glows (5s staggered) |
| **Evidence-Based Design** | Waveform on calibration grid + check | Wave dampens, verification check draws in and fades (7s) |
| **Personalized Protocols** | Orbit nodes around dashed rings | Nodes drift to new positions suggesting recalibration (8s) |

## Design System

- **viewBox**: `0 0 64 64` — consistent across all icons
- **Strokes**: Rounded caps and joins, monoline geometry
- **Glow**: SVG `feGaussianBlur` filter with unique IDs via `useId()`
- **Accent**: `#6366F1` (Indigo 500) — used sparingly for glow nodes
- **Motion**: 4–8 second loops, all respect `prefers-reduced-motion`
- **Hover**: Parent `.group` raises icon opacity from 0.85 → 1.0

## Tailwind Config Extension (Optional)

If you prefer Tailwind utilities over raw CSS classes, add to `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      animation: {
        'brain-glow': 'brain-glow 6s ease-in-out infinite',
        'brain-pulse': 'brain-pulse 6s ease-in-out infinite',
        'signal-flow': 'signal-flow 5s ease-in-out infinite',
        'hub-glow': 'hub-glow 4s ease-in-out infinite',
      },
      keyframes: {
        'brain-glow': {
          '0%, 100%': { opacity: '0.5', 'stroke-width': '1' },
          '50%': { opacity: '0.8', 'stroke-width': '1.5' },
        },
        // ... (see icon-animations.css for full definitions)
      },
    },
  },
};
```
