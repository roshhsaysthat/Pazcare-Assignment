# Skill: roshyoui-design-system

The Part 2 hand-in. A Claude Code skill that lets an agent build an interface for a product it has never seen, in the Roshyoui visual identity, without forcing that product into the portfolio's single-column layout.

**Install.** Copy this folder to `.claude/skills/` in a project (or `~/.claude/skills/` for every project). It expects the design system at `design-system/` in the repo; see the root README for the layout.

**Triggers on.** "Design or build screens", "use my design system", dashboards, profiles, forms and tools.

## What is in the folder

| File | Purpose |
|---|---|
| `SKILL.md` | The workflow the agent follows: read the product in four lines, choose structure from the job, build from existing components, extend by the ladder, verify, report |
| `references/structure-by-job.md` | Which layout to pick for triage, reading, monitoring, browsing and completing a task, with the built example for each |
| `references/gap-ladder.md` | How to extend the system when a pattern is missing, and how to log each decision |
| `references/checklist.md` | What to verify before reporting: identity, responsive, accessibility, with commands |
| `references/lessons.md` | Mistakes already made once (focus on step changes, dead tab stops, icon-less pill nav, and more), so the agent does not repeat them |

## How it handles cases the system was never designed for

Take a dense chat thread, or a long list of books. The agent does not invent new styling. It climbs a four-rung ladder and stops at the first rung that works:

1. **Compose** existing components (a command menu is `Sheet` + `Input` + a listbox).
2. **Native element** styled with tokens (select, radio group, `progress`, `details`).
3. **Product component** from tokens only, with keyboard and ARIA handled (the message composer, the book `Cover`).
4. **Promote** into the shared system only if two products need it, it has no product nouns, and it is documented.

Every rung 3 or 4 decision is logged as one line (gap, choice, why). The messaging and reader products in `src/products/` are the worked examples, and the decisions they produced are in `docs/components.md`.

## What the skill protects

The identity (off-white canvas, ink, pastel tints that identify content, pills, two-tone medium-weight headings, orange only for "needs attention") must hold. Layout, pane count, density and theme may vary freely.

## Tested on a brief it had not seen

A physiotherapy clinic booking flow. Findings, including where the skill and the system broke and what was added, are in `docs/validation.md`; the product itself is parked in `experiments/clinic-booking/`. **Limit:** the same agent wrote and applied the skill, so it was not an independent test.
