import type { Status, Tint } from '../../design-system';

export type Person = { id: string; name: string; role: string; status: Status; bot?: boolean };
export type Channel = {
  id: string;
  name: string;
  topic: string;
  group: 'Hiring' | 'Tools' | 'Team';
  /** Set on direct messages only: the other person's id. */
  dm?: string;
  tint: Tint;
  unread?: number;
  mentions?: number;
  live?: { title: string; speakers: string[]; listeners: number };
};
export type Candidate = { name: string; role: string; stage: string; score: number };
export type Message = {
  id: string;
  author: string;
  time: string;
  body: string;
  reactions?: { emoji: string; count: number; mine?: boolean }[];
  candidate?: Candidate;
  files?: string[];
};
export type Thread = { rootId: string; channelId: string; replies: Message[] };

export const ME = 'jules';

export const people: Person[] = [
  { id: 'jules', name: 'Jules Mehta', role: 'Product designer', status: 'online' },
  { id: 'mira', name: 'Mira Okafor', role: 'Design lead', status: 'online' },
  { id: 'dev', name: 'Dev Sharma', role: 'Frontend engineer', status: 'online' },
  { id: 'anika', name: 'Anika Rao', role: 'Recruiter', status: 'away' },
  { id: 'tomas', name: 'Tomas Berg', role: 'Design ops', status: 'online' },
  { id: 'priya', name: 'Priya Nair', role: 'Senior designer', status: 'busy' },
  { id: 'leo', name: 'Leo Park', role: 'Hiring manager', status: 'offline' },
  { id: 'greenhouse', name: 'Hiring Pipeline', role: 'App', status: 'online', bot: true },
];

export const personById = (id: string) => people.find((p) => p.id === id) ?? people[0];

export const channels: Channel[] = [
  { id: 'lead-hiring', name: 'design-lead-hiring', topic: 'Panel schedule, scorecards and offer decisions for the Design Lead role', group: 'Hiring', tint: 'peach', unread: 3, mentions: 1 },
  { id: 'portfolio-reviews', name: 'portfolio-reviews', topic: 'Async portfolio feedback before the panel', group: 'Hiring', tint: 'cream', unread: 0, live: { title: 'Portfolio review hour', speakers: ['mira', 'priya'], listeners: 9 } },
  { id: 'automation', name: 'automation-tools', topic: 'What we automate in design, and what we refuse to', group: 'Tools', tint: 'sky', unread: 5, mentions: 2, live: { title: 'Automation office hours', speakers: ['tomas', 'dev'], listeners: 14 } },
  { id: 'plugins', name: 'figma-plugins', topic: 'Plugin requests, reviews and security checks', group: 'Tools', tint: 'lilac', unread: 0 },
  { id: 'handoff', name: 'handoff-specs', topic: 'Spec format, tokens and dev handoff', group: 'Tools', tint: 'sage', unread: 2 },
  { id: 'ops', name: 'design-ops', topic: 'Rituals, tooling budget and rollout plans', group: 'Team', tint: 'butter', unread: 0 },
  { id: 'announce', name: 'announcements', topic: 'Read-only team news', group: 'Team', tint: 'ice', unread: 1 },
  { id: 'random', name: 'random', topic: 'Everything else', group: 'Team', tint: 'stone', unread: 0 },
];

export const initialMessages: Record<string, Message[]> = {
  automation: [
    { id: 'a1', author: 'tomas', time: '09:12', body: 'Morning all. **Proposal:** trial an AI plugin that drafts handoff specs from Figma frames. It could cut our spec time, but I want eng and design to weigh in before we pilot anything.', reactions: [{ emoji: '👀', count: 4 }, { emoji: '👍', count: 3, mine: true }] },
    { id: 'a2', author: 'dev', time: '09:20', body: 'Happy to review output quality. Last tool we tried guessed spacing from pixels instead of reading `auto-layout`. Specs that look right but are wrong cost us more than no specs.' },
    { id: 'a3', author: 'priya', time: '09:31', body: 'Same concern for design review. Can we pilot on one flow only, with a human sign-off step? @Tomas Berg' },
    { id: 'a4', author: 'greenhouse', time: '09:48', body: 'Stage update for the Design Lead search.', candidate: { name: 'Noor Hadid', role: 'Design Lead', stage: 'Portfolio review', score: 4 } },
    { id: 'a5', author: 'mira', time: '10:02', body: 'On automation for hiring too: I would automate scheduling and reminders, never scoring. Scorecards stay human. @Jules Mehta can you draft the pilot criteria?', reactions: [{ emoji: '✅', count: 5 }] },
  ],
  'lead-hiring': [
    { id: 'h1', author: 'anika', time: '08:40', body: 'Panel for **Thursday** is set: Mira, Leo, Priya and Dev. Each panelist has a 45 minute slot, scorecards attached.', files: ['panel-schedule.pdf'] },
    { id: 'h2', author: 'leo', time: '08:55', body: 'I will join remote. Please keep the portfolio walkthrough to 20 minutes so we leave time for the systems question.' },
    { id: 'h3', author: 'greenhouse', time: '09:05', body: 'Candidate moved to the next stage.', candidate: { name: 'Noor Hadid', role: 'Design Lead', stage: 'Panel interview', score: 5 } },
    { id: 'h4', author: 'anika', time: '09:30', body: '@Jules Mehta can you confirm you are free to join the debrief on Friday?' },
  ],
  'portfolio-reviews': [
    { id: 'p1', author: 'priya', time: 'Yesterday', body: 'Reviewed three portfolios. The strongest one showed process, not just polish. Notes are in the doc.' },
    { id: 'p2', author: 'mira', time: 'Yesterday', body: 'Agreed. I am adding "shows a real tradeoff" to the rubric.' },
  ],
  plugins: [
    { id: 'f1', author: 'dev', time: 'Mon', body: 'Security review for the token-sync plugin passed. It only reads local styles.' },
    { id: 'f2', author: 'tomas', time: 'Mon', body: 'Thanks. I will add it to the approved list tomorrow.' },
  ],
  handoff: [
    { id: 'd1', author: 'dev', time: '10:15', body: 'Can we agree on one spec format? Right now it is three.' },
    { id: 'd2', author: 'jules', time: '10:22', body: 'Proposing a single template with tokens, states and edge cases. Draft by Wednesday.' },
  ],
  ops: [{ id: 'o1', author: 'tomas', time: 'Mon', body: 'Q4 tooling budget review is Friday. Bring your wish list.' }],
  announce: [{ id: 'n1', author: 'mira', time: 'Mon', body: 'Welcome Noor to the portfolio review stage. Be kind and be on time.' }],
  random: [{ id: 'r1', author: 'priya', time: 'Tue', body: 'Who moved my sticky notes? 😅' }],
};

export const initialThreads: Thread[] = [
  {
    rootId: 'a1',
    channelId: 'automation',
    replies: [
      { id: 'a1r1', author: 'dev', time: '09:24', body: 'I can host a 30 minute bake-off: three plugins, same frame, we diff the output.' },
      { id: 'a1r2', author: 'mira', time: '09:35', body: 'Do it. Success is fewer clarification questions from engineering, not fewer minutes spent.' },
      { id: 'a1r3', author: 'tomas', time: '09:41', body: 'Love that metric. I will track clarification pings per flow for two weeks.', reactions: [{ emoji: '🎯', count: 2 }] },
      { id: 'a1r4', author: 'priya', time: '09:55', body: 'Add a kill switch: if error rate is above 10%, we stop the pilot.' },
    ],
  },
  {
    rootId: 'a5',
    channelId: 'automation',
    replies: [
      { id: 'a5r1', author: 'jules', time: '10:10', body: 'On it. I will post a draft here by end of day.' },
      { id: 'a5r2', author: 'priya', time: '10:14', body: 'Please add a rollback rule. If reviewers disagree with the tool more than one time in ten, we pause.' },
      { id: 'a5r3', author: 'mira', time: '10:18', body: 'Yes. And name one owner per flow, so a person (not the tool) signs off.', reactions: [{ emoji: '👍', count: 3 }] },
    ],
  },
  {
    rootId: 'h1',
    channelId: 'lead-hiring',
    replies: [{ id: 'h1r1', author: 'leo', time: '08:58', body: 'Thanks Anika. Dev, can you own the systems question?' }],
  },
];

export const commands = [
  { id: 'new-thread', label: 'Reply in thread', hint: 'T' },
  { id: 'focus-composer', label: 'Write a message', hint: '/' },
  { id: 'mark-read', label: 'Mark channel as read', hint: 'Shift+R' },
  { id: 'toggle-theme', label: 'Toggle dark theme', hint: 'Shift+D' },
];

export const profiles: Record<string, { email: string; location: string; hours: string; about: string }> = {
  jules: { email: 'jules.mehta@northfield.design', location: 'Berlin', hours: '09:00 to 17:30', about: 'Designs the hiring and automation tools the team uses every day.' },
  mira: { email: 'mira.okafor@northfield.design', location: 'London', hours: '08:30 to 16:30', about: 'Leads the design team and sits on every Design Lead interview panel.' },
  dev: { email: 'dev.sharma@northfield.design', location: 'Pune', hours: '10:00 to 18:30', about: 'Reviews plugin output and owns the systems question in interviews.' },
  anika: { email: 'anika.rao@northfield.design', location: 'Dublin', hours: '09:00 to 17:00', about: 'Runs scheduling and candidate communication for design roles.' },
  tomas: { email: 'tomas.berg@northfield.design', location: 'Amsterdam', hours: '09:00 to 17:00', about: 'Owns tooling budget, rituals and the approved plugin list.' },
  priya: { email: 'priya.nair@northfield.design', location: 'Lisbon', hours: '09:30 to 17:30', about: 'Senior designer. Reviews portfolios and guards the human sign-off step.' },
  leo: { email: 'leo.park@northfield.design', location: 'New York', hours: '09:00 to 17:00', about: 'Hiring manager for the Design Lead role. Joins panels remotely.' },
};

/** Direct messages: one conversation per person, yourself first. Used by Rail. */
const dmTints: Tint[] = ['sky', 'peach', 'sage', 'lilac', 'butter', 'cream', 'ice'];
export const dmChannels: Channel[] = people
  .filter((p) => !p.bot)
  .sort((a, b) => (a.id === ME ? -1 : b.id === ME ? 1 : 0))
  .map((p, i) => ({
    id: `dm-${p.id}`, name: p.id === ME ? `${p.name} (you)` : p.name, topic: p.role, group: 'Team' as const, tint: dmTints[i % dmTints.length], dm: p.id,
    unread: p.id === 'mira' || p.id === 'anika' ? 1 : p.id === 'priya' ? 5 : 0,
  }));
export const dmMessages: Record<string, Message[]> = {
  'dm-jules': [{ id: 'dm-j1', author: 'jules', time: 'Mon', body: 'Note to self: pilot criteria draft, keep scorecards human.' }],
  'dm-mira': [{ id: 'dm-m1', author: 'mira', time: '09:50', body: 'Can you keep the pilot criteria to one page? Leo will read it on his phone.' }],
  'dm-priya': [{ id: 'dm-p1', author: 'priya', time: '09:12', body: 'Could you send me the pilot criteria before Friday? I opened the old draft earlier but it was completely out of date.' }],
  'dm-dev': [{ id: 'dm-d1', author: 'dev', time: 'Mon', body: 'Bake-off is booked for Thursday afternoon. Same frame, three plugins.' }],
  'dm-anika': [{ id: 'dm-a1', author: 'anika', time: '09:35', body: 'Thursday panel is confirmed. Want the portfolio link in the invite?' }],
};
