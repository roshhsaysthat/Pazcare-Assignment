import { ChatsCircle, BookOpen, CalendarCheck } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import RailConcept from './messaging/RailConcept';
import CanvasConcept from './messaging/CanvasConcept';
import RoomsConcept from './messaging/RoomsConcept';
import { messagingConcepts } from './messaging/concepts';
import NowConcept from './reader/NowConcept';
import YearConcept from './reader/YearConcept';
import ShelvesConcept from './reader/ShelvesConcept';
import { readerConcepts } from './reader/concepts';
import BookingFlow from './booking/BookingFlow';

type Meta = { id: string; letter: string; name: string; reference: string; preferred: boolean; idea: string; why: string };
export type ProductDef = { id: string; name: string; icon: ReactNode; blurb: string; concepts: readonly Meta[]; views: Record<string, () => JSX.Element> };

export const products: ProductDef[] = [
  {
    id: 'messaging', name: 'Team messaging', icon: <ChatsCircle size="1.25em" aria-hidden="true" />,
    blurb: 'A Slack alternative for a design team: channels, a thread and a composer.',
    concepts: messagingConcepts, views: { rail: RailConcept, canvas: CanvasConcept, rooms: RoomsConcept },
  },
  {
    id: 'reader', name: 'Reader profile', icon: <BookOpen size="1.25em" aria-hidden="true" />,
    blurb: 'A Goodreads-style profile: current reads, shelves, yearly challenge and reviews.',
    concepts: readerConcepts, views: { now: NowConcept, year: YearConcept, shelves: ShelvesConcept },
  },
  {
    id: 'booking', name: 'Clinic booking', icon: <CalendarCheck size="1.25em" aria-hidden="true" />,
    blurb: 'Skill test: a stepwise appointment flow from a brief the system had never seen. See docs/validation.md.',
    concepts: [{ id: 'flow', letter: 'T', name: 'Flow', reference: 'Skill test.', preferred: false, idea: 'One question per step, one primary button, a quiet summary beside it.', why: 'Built only from the skill and the shared components to test whether the system extends to an unfamiliar job.' }],
    views: { flow: BookingFlow },
  },
];

/** Parse #/product/concept. Old #/concept links still resolve to messaging. */
export function parseHash(hash: string): { product: ProductDef; concept: string } {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  const byId = products.find((p) => p.id === parts[0]);
  const product = byId ?? products[0];
  const conceptId = byId ? parts[1] : parts[0];
  const concept = product.concepts.find((c) => c.id === conceptId)?.id ?? product.concepts[0].id;
  return { product, concept };
}
