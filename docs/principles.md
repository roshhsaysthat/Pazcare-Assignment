# Visual principles, responsive and accessibility rules

Source of truth for values is `src/design-system/tokens.css`. Provenance of each value is in `provenance.md`.

## Identity: what must hold in every product

1. **The canvas is off-white or white.** Colour appears only as ink, a pastel tint, or the one orange signal.
2. **Headings are medium weight with tight tracking (-0.045em), never bold.** Each page title gets one two-tone heading: a grey lead-in, then a black payoff.
3. **Actions and labels are pills. Feature surfaces use 16 to 24px radii.** No sharp corners.
4. **Separate with space and hairlines first, cards second, shadows last.**
5. **Tints identify content** (a book, a channel, a person), they never decorate chrome.
6. **Orange means "needs your attention"** and is used sparingly (mentions, behind-pace).
7. **Motion is short and eased,** and honours `prefers-reduced-motion`.

## What may vary freely

Layout, pane count, density, theme, illustration, content tone. The portfolio is a single editorial column; products are not. Choose structure from the job the user is doing:

| Job | Structure | Used in |
|---|---|---|
| Triage many items | Master-detail panes | Messaging: Rail |
| Read and reflect | One editorial column, about 65ch | Messaging: Canvas; Reader: Now |
| Monitor numbers | Stat strip, one primary visual, a list | Reader: Year |
| Browse a collection | Visual grid, filters, detail in a sheet | Reader: Shelves |
| Complete a task | One-column stepwise flow, one primary button per step | (unfamiliar-brief test) |

## Responsive rules

Mobile first. Breakpoints 640, 900, 1200. Check at 390, 768 and 1280px.

- Below 900px, collapse to one pane and move secondary panes into a `Sheet`.
- Side sheets become bottom sheets below 640px.
- The pill `Nav` hides its text labels below 640px, so **every item must carry an icon**. Found the hard way when a text-only switcher rendered empty on mobile.
- Anything that can overflow (tags, long titles) must wrap or truncate. Check `scrollWidth <= innerWidth` at 390px.
- Charts are measured and drawn at their container's pixel width so type stays 12px, never scaled down.

## Accessibility rules (non-negotiable)

- Every input has a label (visually hidden when compact). Hints and errors are linked with `aria-describedby`. Errors use `role="alert"`.
- One `main` landmark per view. Every `nav` has a label.
- Everything is keyboard reachable with a visible focus ring (`--ds-focus-ring`).
- Tap targets are 44px or larger on coarse pointers.
- Status is never colour alone: tags pair a dot with text, ratings expose "4 out of 5 stars".
- `--ds-text-soft` (#8a8a8a) only for 24px and larger text. It fails AA contrast for small text.
- A row is a button only if it does something. Static rows are plain elements, so keyboard users never meet dead tab stops.
- Charts get a text summary in `aria-label` and a visually hidden data table.
- Notices use an inline `Banner` with `role="status"` and a dismiss button. The system deliberately has no toast.
- Dialogs are native `<dialog>`: Esc and backdrop close, a title is required, and they never stack.
