export const concepts = [
  {
    id: 'rail', letter: 'A', name: 'Rail', reference: 'Discord-style.', preferred: true,
    idea: 'Channels, conversation, thread and composer all in view at once, driven from the keyboard.',
    why: 'Preferred. It is the only concept that shows channels, a thread and the composer together at desktop width, and the Ctrl K palette plus j/k/t keys serve the high-frequency scanning job. Caveat: it relies on the inferred dark theme.',
  },
  {
    id: 'canvas', letter: 'B', name: 'Canvas', reference: 'Teams-style.', preferred: false,
    idea: 'Conversation-first: every post carries its thread inline, so replies are the main reading experience.',
    why: 'Closest to the portfolio and best for slower, async discussion. It loses to A on speed: switching between threads means scrolling, not jumping.',
  },
  {
    id: 'rooms', letter: 'C', name: 'Rooms', reference: 'Clubhouse-style.', preferred: false,
    idea: 'A unified inbox pulls mentions from every channel into one list, with live huddles one tap away.',
    why: 'Strongest on triage and replying without leaving the inbox, and most mobile friendly. Text is demoted next to presence, which hurts when the work is mostly reading and writing.',
  },
] as const;
