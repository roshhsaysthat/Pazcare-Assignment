# Choosing structure from the job

The portfolio is one editorial column. That suits reading and reflecting. Most products do something else.

| Job | Structure | Existing example |
|---|---|---|
| Compare or triage many items | Master-detail panes, or one feed with a preview pane | `messaging/RailConcept` (four panes), `messaging/RoomsConcept` (inbox) |
| Read and reflect | Single editorial column, about 65ch, side rail for secondary info | `messaging/CanvasConcept`, `reader/NowConcept` |
| Monitor numbers | Stat strip, one primary visual, then a list. Never a grid of identical cards | `reader/YearConcept` |
| Browse a collection | Visual grid, filter chips, detail in a side or bottom sheet | `reader/ShelvesConcept` |
| Complete a task | One-column stepwise flow, one primary button per step | see the validation report in `docs/validation.md` |

## Density and theme

- Rapid scanning (inbox, queue, logs): denser rows (44px minimum), 8 or 12px radii, consider dark.
- Calm reading: generous space, 16 to 24px radii, light.
- Dark is inferred (not in the portfolio). Use it only for dense, pro or long-session tools, and say so in the report.

## Same product, different hierarchy

Product B (reader profile) was built three ways from one data model. The only thing that changed was **what leads**: the current book (Now), the numbers (Year), the collection (Shelves). When asked for "distinct concepts", vary the hierarchy and the primary action, not the colours.

## Responsive pattern per structure

- Panes: collapse to one pane below 900px, secondary panes become a `Sheet`.
- Column plus rail: rail drops below the column, challenge or summary stays reachable.
- Stat strip: 4 across, then 2 by 2 on mobile.
- Grid: `repeat(auto-fill, minmax(132px, 1fr))`, filters stay sticky.
