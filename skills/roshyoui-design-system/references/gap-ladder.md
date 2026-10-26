# Handling patterns the system does not define

Climb in order. Stop at the first rung that works.

1. **Compose** from existing components (a command menu is `Sheet` + `Input` + a listbox).
2. **Native element**, styled with tokens (select, radio group, `progress`, `details`, file input). Free keyboard and screen reader behaviour.
3. **Product component** using tokens only, with keyboard and ARIA handled by you. Keep product nouns here (Composer, Cover, Message).
4. **Promote to the system** only when: two products need it, it has no product nouns, it uses tokens only, and it is documented in `docs/components.md`.

## Log every rung 3 or 4 decision as one line

`Gap | Choice | Rung | Why`

Real examples from this repo:

| Gap | Choice | Rung | Why |
|---|---|---|---|
| Toast | Inline `Banner` with Undo | 1 | System has no toast by design |
| Month and genre filter | Native `<select>` | 2 | Mobile pickers for free |
| Star rating input | Native radio group | 2 | Arrow keys and labels for free |
| Message composer | Product component | 3 | Messaging noun, one product |
| Chart | Hand-built SVG, ink and grey, hidden data table | 3 | One chart did not justify a library |
| Meter showing a count | `Meter` gains `display` prop | 4 | Two products showed "5/5" for counts |

## Do not

- Invent a new colour. Use a tint or the signal.
- Add a library to solve one component.
- Promote something on first use "in case".
- Leave a gap undocumented: the log is how the next person (or agent) learns what was decided.
