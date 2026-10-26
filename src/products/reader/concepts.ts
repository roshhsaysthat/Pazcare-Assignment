export const readerConcepts = [
  {
    id: 'now', letter: 'A', name: 'Now', reference: 'Reading-first.', preferred: true,
    idea: 'The book in your hands leads: progress you can update in two taps, with the yearly challenge and shelves as a quiet side rail.',
    why: 'Preferred. A reader opens this profile to log where they are, so the current read leads and the page counter is the main action. It keeps the portfolio\'s editorial feel without dashboard noise.',
  },
  {
    id: 'year', letter: 'B', name: 'Year', reference: 'Stats-first.', preferred: false,
    idea: 'The year as a dashboard: a stat strip, one chart of progress against the goal, then what you actually read.',
    why: 'Best for the reader who wants to know whether they will hit the goal, and the clearest answer to "am I behind?". It demotes the book itself, so it is a poor home for the daily act of logging a page.',
  },
  {
    id: 'shelves', letter: 'C', name: 'Shelves', reference: 'Collection-first.', preferred: false,
    idea: 'Your library is the page: a cover grid you filter by shelf and genre, with every book editable in a side sheet.',
    why: 'Best for browsing and curating a large library, and the closest to how people actually use a bookshelf. The profile itself recedes, so it says little about who the reader is.',
  },
] as const;
