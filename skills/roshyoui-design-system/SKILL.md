---
name: roshyoui-design-system
description: Design or build product UI (apps, dashboards, profiles, forms, tools) in the Roshyoui visual language of off-white canvas, ink black, pastel tints, pill shapes and two-tone headings. Use when asked to design or build screens, or to "use my design system".
---

# Roshyoui design system

Apply an existing visual identity to products it has never seen. The identity is the **tokens, type, shapes and tone**. It is NOT the portfolio's single-column layout: never force a product into that layout.

Where things live in this repo:
- Tokens: `src/design-system/tokens.css` (single source of truth, never copy hex into product code)
- Components: `src/design-system/index.ts` (Button, Input and Textarea, Card, Tag and FilterTag, Nav, List and ListRow, Sheet, Avatar, Banner, Meter)
- Worked examples: `src/products/messaging/*`, `src/products/reader/*`
- Provenance of every value: `docs/provenance.md`

## Workflow

### 1. Understand the product (write 4 lines before any code)
Who uses it and when. The 3 things they do most. Density: calm reading or rapid scanning. Theme: light by default; dark only for dense, pro or long-session tools.

### 2. Choose the structure from the job, not from the portfolio
Read `references/structure-by-job.md`. In short: triage, use master-detail panes; read, use one editorial column; monitor numbers, use a stat strip, one chart and a list; browse, use a visual grid with filter chips and a detail sheet; complete a task, use a one-column stepwise flow.

### 3. Build from existing pieces
- Import from `src/design-system`. Do not re-implement Button, Input, Card, Tag, Nav, List, Sheet, Avatar, Banner or Meter.
- Use CSS variables only (`var(--ds-...)`). No raw hex in product CSS.
- Headings are weight 500 with `--ds-tracking-display`. One two-tone page title per view: `<h1><span class="ds-soft">Grey lead-in,</span> black payoff.</h1>`.
- Pills for actions and labels. Radii 8, 12, 16, 24. Separate with space and hairlines first, cards second, shadows last.
- Tints identify content (a book, a channel, a person). Orange (`--ds-signal`) means "needs your attention", sparingly.

### 4. When a pattern is missing, climb the ladder and stop at the first rung that works
1. Compose it from existing components.
2. Use a native element (select, radio group, progress, details) styled with tokens.
3. Make a product-specific component with tokens only, handling keyboard and ARIA.
4. Promote into the shared system only if two products need it, it has no product nouns, and it is documented.

No toast exists: use `Banner` (`role="status"`, dismiss button). Tabs and segmented controls: `FilterTag` in a labelled group. Record every rung 3 or 4 decision as one line: gap, choice, why. See `references/gap-ladder.md`.

### 5. Verify before reporting (details in `references/checklist.md`)
Type-check and build. Look at 390, 768 and 1280px. No horizontal overflow. Keyboard-walk the main flow. Run an automated accessibility scan. Read `references/lessons.md` first: it lists the mistakes already made once.

### 6. Report
Components reused, components added, gaps and the decision taken, assumptions, and what is inferred or unverified. Never claim a check passed unless it was run.

## Provenance (say this when reporting)
Measured from screenshots: `#fafafa` canvas, `#000` ink, the card tints. Inferred and unverified: Inter Tight and Inter, Phosphor icons, all motion values, the dark theme, status colours. See `docs/provenance.md`.

## Avoid
Copying the portfolio hero or footer into product screens. Every card a pastel gradient. Gradient buttons. Div-built selects or checkboxes. Shadows everywhere. Hex in product CSS. Uppercase letter-spaced labels. Bold headings. Dead tab stops (buttons that do nothing).
