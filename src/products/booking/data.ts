import type { Tint } from '../../design-system';

export type Service = { id: string; name: string; minutes: number; blurb: string; tint: Tint };
export type Clinician = { id: string; name: string; focus: string };

export const services: Service[] = [
  { id: 'assess', name: 'Initial assessment', minutes: 45, blurb: 'A first visit to understand the problem and agree a plan.', tint: 'sky' },
  { id: 'follow', name: 'Follow-up', minutes: 30, blurb: 'Treatment and progress check for an existing plan.', tint: 'sage' },
  { id: 'sport', name: 'Sports injury review', minutes: 45, blurb: 'For strains, sprains and return-to-play planning.', tint: 'butter' },
  { id: 'remote', name: 'Remote check-in', minutes: 20, blurb: 'A short video call to adjust exercises.', tint: 'lilac' },
];

export const clinicians: Clinician[] = [
  { id: 'any', name: 'First available', focus: 'Soonest slot with any clinician' },
  { id: 'amara', name: 'Amara Osei', focus: 'Sports and running injuries' },
  { id: 'jonas', name: 'Jonas Keller', focus: 'Back and neck pain' },
  { id: 'mei', name: 'Mei Tanaka', focus: 'Post-surgery recovery' },
];

/** Demo clock matches the reader product so both demos share one "today". */
export const TODAY = '2026-10-26';

export type Day = { iso: string; label: string; long: string };
export function nextDays(n = 7): Day[] {
  const out: Day[] = [];
  const d = new Date(TODAY + 'T00:00:00');
  while (out.length < n) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() === 0) continue; // clinic closed on Sundays
    out.push({
      iso: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' }),
      long: d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }),
    });
  }
  return out;
}

const TIMES = ['08:30', '09:15', '10:00', '11:30', '13:00', '14:15', '15:30', '17:00'];
/** Deterministic pseudo-availability so the demo is repeatable. */
export function slotsFor(iso: string, clinician: string): { time: string; free: boolean }[] {
  const seed = [...(iso + clinician)].reduce((n, c) => n + c.charCodeAt(0), 0);
  return TIMES.map((time, i) => ({ time, free: (seed + i * 7) % 3 !== 0 }));
}
