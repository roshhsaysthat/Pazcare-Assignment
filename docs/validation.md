# Skill validation: an unfamiliar brief

## The brief

> A small physiotherapy clinic wants an online booking flow. A patient picks a type of visit, a clinician and a time, enters their details, and confirms. Calm, trustworthy, quick. Works on a phone.

Chosen because it differs from both products already built: it is a **stepwise task** (not triage, reading or browsing) and needs patterns the system has never defined: a stepper, a day and time picker, a form with validation, a summary, a confirmation.

Result: `experiments/clinic-booking/` (parked, see its README; was `#/booking/flow`).

## How the test was run, and its limit

I followed `skills/roshyoui-design-system/SKILL.md` step by step: four-line product read, structure from the job, build from existing components, climb the ladder for gaps, verify, report.

**This is not an independent test.** The same agent wrote the skill and applied it, so it knew the repo and the lessons already learned. That inflates how well the skill appears to work. A fair version is a fresh agent with only the repo and the skill, given the brief cold. That has not been run; it is the next thing to do.

## What worked

- **The job-to-structure table did its job.** "Complete a task" gave a one-column flow with one primary button per step. No pressure to copy the portfolio layout, and the result still reads as the same identity (two-tone title, pills, tint chips, hairline cards).
- **Most gaps closed at rung 1 or 2, with no new components:**
  - Stepper: `Meter` with a text label ("Step 2 of 4: Time"). This only worked because `Meter` already had a `display` prop, added earlier after the reader product showed "5/5" for counts. The ladder's rung 4 paid off.
  - Day and time pickers: `FilterTag` groups with `aria-pressed`.
  - Visit type: native radio group, styled as cards.
  - Clinician: native `<select>` with `ds-input`.
  - Mobile summary: native `<details>`.
  - Confirmation: tint `Card`.
- **Tokens only.** No raw colours were needed. The raw-colour scan is clean.
- **Quality bar held.** 18 interaction checks pass (step gating, focus, validation, back keeps data, confirmation, reset, mobile summary) and axe reports 0 WCAG A/AA violations on four states (steps 1 to 3 and confirmation). No horizontal overflow at 390px.

## Where the system or the skill broke

| Finding | What happened | Resolution |
|---|---|---|
| **Skill had no guidance for multi-step flows** | The first build stole focus on page load and showed a focus ring on the step heading. Nothing in the skill covered focus management. | Fixed in the product. Added to `lessons.md` (items 11 and 12) and the checklist, so the next agent starts with it. |
| **`FilterTag` had no disabled state** | "Taken" slots looked identical to free ones. | Added a dashed, struck-through disabled style to the system (rung 4: no product nouns). Accessible name still says "unavailable". |
| **No shared styling for native radio, checkbox or select** | The skill says "use native elements styled with tokens", but styling lives in product CSS. The reader rating and the booking visit cards are both hand-styled radio groups. | Not fixed. This is the clearest candidate for a shared `Choice` component, and a second product now needs it. It is promotable under the skill's own rule. |
| **No date or calendar picker** | A strip of 6 days works. Anything past two weeks would not. | Left as a limit. A real calendar is a rung 3 component with real keyboard work and was out of scope. |
| **Form patterns are thin** | Only `Input` and `Textarea` exist. No select component, no field-group, no inline-error summary. | Used native elements. Errors show on submit only, with `role="alert"`. |
| **No loading, empty or failure states** | A real booking flow needs "slot just taken" and "network error". The system defines none. | Not built. Listed as a gap. |

## How the skill handled missing patterns

It worked as designed: every gap was tried at rung 1, then 2, and only the disabled tag reached rung 4. Each decision was recorded as one line in `docs/components.md`. The ladder prevented new components being invented for the stepper, picker or summary.

## Honest scope notes

- Nothing is sent and no booking is stored. The confirmation says so on screen rather than implying an email went out.
- Clinic, clinicians and availability are fictional and deterministic.
- Not tested: screen readers, real devices, Safari and Firefox.

## Recommended next steps

1. Run the independent version of this test with a fresh agent and a second brief, and compare.
2. Promote a shared `Choice` component (radio card and rating star) and a shared select style.
3. Decide whether the dark theme and status colours are real parts of the identity, since they are inferred.
