# Experiment: Clinic booking flow (parked)

Removed from the app's top bar. Everything needed to bring it back is in this folder. It was the **skill test**: a product built from an unfamiliar brief using only `skills/roshyoui-design-system` and the shared components. Full findings are in `docs/validation.md`.

## The brief

A small physiotherapy clinic wants an online booking flow. A patient picks a type of visit, a clinician and a time, enters details, and confirms. Calm, trustworthy, quick. Works on a phone.

## Core idea

One question per step, one primary button, a quiet summary beside it. Structure comes from the job ("complete a task"), not from the portfolio layout.

## The flow

| Step | Screen heading | What the user does | Gate to continue | Design-system parts |
|---|---|---|---|---|
| 1 Visit | What do you need? | Picks one of four visit types (assessment 45 min, follow-up 30, sports injury 45, remote check-in 20) | A visit type is chosen | Native radio group styled as cards, tint chip showing minutes |
| 2 Time | Pick a time | Picks a clinician (or "First available"), a day (next 6 non-Sunday days), then a slot | A slot is chosen. Changing clinician or day clears the slot | Native `select` with `ds-input`, `FilterTag` groups, disabled `FilterTag` for taken slots |
| 3 Details | Your details | Full name, email, optional note | Name present and email valid, errors only after the first try | `Input`, `Textarea` |
| 4 Review | Check and confirm | Reads the summary, confirms | None | outline `Card`, summary list |
| Done | You are booked, {first name}. | Sees reference number, can book another | n/a | tint `Card` (sage), says plainly that nothing was sent |

Cross-cutting rules in the flow:
- **Stepper** is a `Meter` with a text label ("Step 2 of 4: Time"), not colour alone.
- **Summary** sits in a right column at 900px and above, and in a `<details>` ("Your visit so far") below it.
- **Focus** moves to the new step's heading on every step change (headings are `tabIndex={-1}`), skipped on first render so the page does not grab focus on load.
- **Back** keeps all entered data. Only "Book another visit" resets.
- **Availability** is deterministic pseudo-data (`data.ts`), so demos repeat. Demo "today" is 2026-10-26, shared with the reader product.
- **Honesty:** nothing is stored or sent, and the confirmation says so.

## Known gaps (not built)

No loading, "slot just taken" or network-error states. Native radio, checkbox and select styling lives in this product's CSS, not in the system. See the findings table in `docs/validation.md`.

## Files

| File | Purpose |
|---|---|
| `src/BookingFlow.tsx` | The flow, local React state only |
| `src/data.ts` | Services, clinicians, deterministic slots |
| `src/booking.css` | Product CSS, tokens only |
| `booking.e2e.py` | 18 interaction checks plus 4 axe scans |
| `booking-flow.png` | Screenshot |

## Bring it back

1. Move the folder: `git mv experiments/clinic-booking/src src/products/booking`, `git mv experiments/clinic-booking/booking.e2e.py tests/e2e/booking.py`.
2. In `src/products/registry.tsx` add `CalendarCheck` to the Phosphor import, `import BookingFlow from './booking/BookingFlow';`, and this entry to `products`:

```tsx
{
  id: 'booking', name: 'Clinic booking', icon: <CalendarCheck size="1.25em" aria-hidden="true" />,
  blurb: 'Skill test: a stepwise appointment flow from a brief the system had never seen.',
  concepts: [{ id: 'flow', letter: 'T', name: 'Flow', reference: 'Skill test.', preferred: false, idea: 'One question per step, one primary button, a quiet summary beside it.', why: 'Built only from the skill and the shared components to test whether the system extends to an unfamiliar job.' }],
  views: { flow: BookingFlow },
},
```

3. In `tests/run.sh` change the loop to `for t in messaging reader booking`.
4. Run `npm run build && npm run test:e2e`.

## Ideas to experiment with

- Run the brief cold with a fresh agent and only the skill (the original test was not independent).
- Add the missing states: slot just taken, network error, loading.
- Move the radio-card and select styling into the design system.
- Try a different structure for the same job: a single page with all four sections instead of steps, or a calendar-first layout.
