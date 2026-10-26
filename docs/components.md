# Components and how gaps were handled

Import everything from `src/design-system`. Ten shared components, tokens only, no raw hex in product CSS.

| Component | Variants | Behaviour that matters |
|---|---|---|
| `Button` | primary, secondary, ghost, danger; sm 32, md 40, lg 48 | Pill. Press scales to 0.97. One primary per region. `iconOnly` requires `aria-label` (enforced by the types). Danger is outlined, never solid. |
| `Input`, `Textarea` | none | Always labelled (`hideLabel` for compact). Border darkens on hover, ink on focus plus ring. Hint and error linked by `aria-describedby`. |
| `Card` | outline, tint, inverse, flat; sizes dense, md, lg, xl | Tint cards take a `tint` and identify content. Interactive only if the whole card is one action. |
| `Tag`, `FilterTag` | neutral, signal, success, danger, info | Status tones always show a dot and text. `FilterTag` is a toggle with `aria-pressed`, selected is ink fill. |
| `Nav` | pill, stack, rail | Landmark label required. `aria-current="page"` on the active item. Pill hides labels under 640px. |
| `List`, `ListRow` | none | Hairline rows, 44px minimum. Arrow keys, Home and End move focus. A row with no `onClick` renders as a plain element. |
| `Sheet` | center, right, left, bottom | Native dialog. Title required. Esc and backdrop close. Side variants become bottom sheets under 640px. Focuses a `[data-autofocus]` child on open. |
| `Avatar` | circle, square (apps, bots) | Initials on a deterministic pastel from the name. Status is announced in the accessible name. |
| `Banner` | none | `role="status"`, optional dismiss. Replaces toasts. |
| `Meter` | none | Native `<progress>`. Always shows a number. Pass `display` when "value/max" would mislead, for example a count. |

## Decisions for patterns the portfolio does not define

Ladder: 1 compose existing components, 2 style a native element, 3 build a product component from tokens, 4 promote to the system. Rung 4 only when two products need it, it has no product nouns and it is documented.

| Gap | Choice | Rung | Why |
|---|---|---|---|
| Message composer, mention picker | Product component built on `Button`; native textarea as an ARIA combobox plus listbox | 3 | Messaging-specific. Not yet needed by a second product. |
| Command menu | `Sheet` + `Input` + listbox | 1 to 3 | Composition only, no new system component. |
| Toast | None. Inline `Banner` with Undo | 1 | System has no toast by design. Reader Now and Rooms use it. |
| Dialog autofocus | `Sheet` focuses `[data-autofocus]` after `showModal()` | 4 | React `autoFocus` fires before a `<dialog>` opens. A system bug found by testing, fixed in the shared component. |
| Static list row | `ListRow` renders a plain element without `onClick` | 4 | The Year list shipped 14 dead tab stops. Fixed in the shared component. |
| Count vs score on a meter | `Meter` `display` prop | 4 | A genre meter read "5/5" like a rating. |
| Select, month and genre filters | Native `<select>` styled with `ds-input` | 2 | Native behaviour and mobile pickers for free. |
| Rating input | Native radio group with star icons, inputs visually hidden | 2 to 3 | Arrow keys and screen readers work for free. |
| Book cover | Generated typographic cover on a tint (`Cover`) | 3 | No real cover art. Product noun, so it stays out of the system. |
| Chart | Hand-built SVG measured to container, with a hidden data table | 3 | One chart did not justify a chart library. Colours are ink and grey only. |
| Dark theme | Inferred palette in `tokens.css` under `[data-theme='dark']` | n/a | The portfolio has none. Needs a design decision. |

Promotion candidates once a second product needs them: the composer's attachment chips, the avatar stack, and the stat strip.
