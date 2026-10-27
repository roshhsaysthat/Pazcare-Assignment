# design-system/

The Roshyoui design system, extracted from the portfolio at roshyoui.framer.website. This folder is the Part 1 hand-in: **tokens**, **React components**, and the documentation index. The skill that lets an agent use it is in `skills/roshyoui-design-system/`.

**Verified vs inferred.** The live site could not be fetched from the build environment, so the only measured values come from two supplied screenshots (canvas, ink, four card tints). Fonts, Phosphor icons, motion, the dark theme and status colours are inferred. Each is labelled below and fully explained in `docs/provenance.md`.

## Use it

```tsx
import { Button, Card, Tag } from '../design-system';   // relative to your file
```

Importing the index also loads the fonts, `tokens.css` and `components.css`. Product CSS uses `var(--ds-...)` only, never raw hex.

## Tokens (`tokens.css`)

| Category | Tokens | Status |
|---|---|---|
| **Colour: surfaces and ink** | `--ds-bg #fafafa`, `--ds-surface`, `--ds-surface-sunken`, `--ds-text #000`, `--ds-text-muted`, `--ds-text-soft` (24px+ only), `--ds-border`, `--ds-border-strong` | `bg` and `text` **measured**; the rest inferred |
| **Colour: tints** | `sky #a8dcff`, `ice #d3e6ff`, `stone #e9e9e9`, `cream #fff0da` | **measured** (rounded, sampled from gradients) |
| | `sage`, `peach`, `butter`, `lilac`, `rose` | inferred (not visible in the screenshots) |
| **Colour: status** | `--ds-signal #c2410c` (orange, "needs attention"), `success`, `danger`, `info` | inferred; the portfolio shows no status colours |
| **Type** | Display `Inter Tight` (tracking -0.045em, weight 500), body `Inter`; scale `display`, `h1`, `h2`, `title`, `body-lg`, `body`, `caption` (fluid `clamp()` for the top three) | fonts inferred; the look (tight, medium, grotesque) observed |
| **Spacing** | 4px base: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 96 (`--ds-space-1` to `-24`) | inferred (standard practice) |
| **Radius** | 8, 12, 16, 24, pill (`--ds-radius-sm` to `-pill`) | 24px on cards eyeballed; the rest conventional |
| **Elevation** | `--ds-elev-1` hairline ring, `-2`, `-3`, `-4` soft shadows. Hairlines before cards before shadows | inferred; hairline-first is observed |
| **Motion** | Duration 140 / 220 / 360ms (`--ds-dur-fast/base/slow`); easing `--ds-ease`, `--ds-ease-in`, `--ds-ease-out`; all durations collapse under `prefers-reduced-motion` | **inferred**, static screenshots show no motion |
| **Dark theme** | Full palette under `[data-ds-theme='dark']` | **inferred**; the portfolio has no dark mode |

## Components (`components/`, exported from `index.ts`)

All eight required components are present, plus two extras.

| Component | What it is | Notes |
|---|---|---|
| `Button` | Pill; primary, secondary, ghost, danger; sm, md, lg | Icon-only buttons require `aria-label` (enforced by types) |
| `Input`, `Textarea` | Always-labelled fields | Hint and error wired with `aria-describedby` |
| `Card` | outline, tint, inverse, flat; four sizes | Tint cards identify content |
| `Tag`, `FilterTag` | Status labels and toggle chips | Dot plus text, never colour alone |
| `Nav` | pill, stack, rail | Landmark label required, `aria-current` on active |
| `List`, `ListRow` | Hairline rows, keyboard navigable | Static rows render as plain elements |
| `Sheet` | Modal as native `<dialog>`: center, right, left, bottom | Side sheets become bottom sheets under 640px |
| `Avatar` | Initials on a deterministic tint, or an image | Status announced in the accessible name |
| `Banner` | Inline notice, `role="status"` | Replaces toasts, which the system deliberately lacks |
| `Meter` | Native `<progress>` with a visible number | |

## Documentation

| Doc | Covers |
|---|---|
| `docs/principles.md` | Visual principles that must hold in every product, what may vary, responsive rules, accessibility rules |
| `docs/components.md` | Component behaviour, and the **decision table for gaps the portfolio does not define** (composer, command menu, toast, select, rating, chart, dark theme and more), each with the rung of the extension ladder it was solved at |
| `docs/provenance.md` | Measured vs observed vs inferred, and how to verify each inferred item |
| `docs/screens/` | Screenshots of the layouts built on the system |

## Gaps the system fills (summary)

The portfolio is a single editorial column with no forms, lists, panes, charts or states. Where it was silent, the system composes existing parts first, then native elements styled with tokens, then product-specific components, and only promotes to the shared system when two products need it. Four gaps were promoted after tests exposed them: dialog autofocus, static list rows, a count display on `Meter`, and a disabled filter chip. Details and reasons are in `docs/components.md`.
