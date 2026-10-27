# products/

The six runnable layouts. The code lives in `src/products/` because Vite and React build from `src/`; this page is the index. All six run in one app: `npm install && npm run dev`, then open the route below (or use the top bar).

Preferred layouts are marked. Full reasoning for each is in the app's **Compare** panel and in the root `README.md`.

## Product A: Team messaging (Slack alternative)

| | Layout | Core idea | Route | Source |
|---|---|---|---|---|
| **Preferred** | **A. Meetify** (keyboard-driven) | Channels, conversation, thread and composer all in view at once, driven from the keyboard. | `#/messaging/rail` | `src/products/messaging/RailConcept.tsx` |
| | **B. Canvas** (conversation-first) | Every post carries its thread inline, so replies are the main reading experience. | `#/messaging/canvas` | `src/products/messaging/CanvasConcept.tsx` |
| | **C. Rooms** (unified inbox) | A unified inbox pulls mentions from every channel into one list, with live rooms one tap away. | `#/messaging/rooms` | `src/products/messaging/RoomsConcept.tsx` |

**Why Meetify.** It is the only concept that shows channels, a thread and the composer together at desktop width, and the command menu plus shortcuts serve the high-frequency scanning job.

## Product B: Reader profile (Goodreads-style)

| | Layout | Core idea | Route | Source |
|---|---|---|---|---|
| **Preferred** | **A. Now** (reading-first) | The book in your hands leads: progress you can update in two taps, with the yearly challenge and shelves as a quiet side rail. | `#/reader/now` | `src/products/reader/NowConcept.tsx` |
| | **B. Year** (stats-first) | The year as a dashboard: a stat strip, one chart of progress against the goal, then what you actually read. | `#/reader/year` | `src/products/reader/YearConcept.tsx` |
| | **C. Shelves** (collection-first) | Your library is the page: a cover grid you filter by shelf and genre, with every book editable in a side sheet. | `#/reader/shelves` | `src/products/reader/ShelvesConcept.tsx` |

**Why Now.** A reader opens their profile to log where they are, so the current read leads and the page counter is the main action. It keeps the portfolio's editorial feel without dashboard noise.

## Shared, and parked

- Design system used by all six: `design-system/`.
- Parked skill-test product (clinic booking flow): `experiments/clinic-booking/`.
