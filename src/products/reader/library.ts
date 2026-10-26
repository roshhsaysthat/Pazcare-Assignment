import { useCallback, useMemo, useState } from 'react';
import { initialBooks, MONTHS, reader, TODAY, type Book, type Shelf } from './data';

const year = TODAY.slice(0, 4);
const dayOfYear = (iso: string) => Math.floor((Date.parse(iso) - Date.parse(`${iso.slice(0, 4)}-01-01`)) / 86_400_000) + 1;

/** Derived reading statistics. Pure function of the books, so every concept agrees on the numbers. */
export function computeStats(books: Book[]) {
  const finished = books.filter((b) => b.shelf === 'read' && b.finished?.startsWith(year));
  const perMonth = MONTHS.map((_, i) => finished.filter((b) => Number(b.finished!.slice(5, 7)) === i + 1));
  const pages = finished.reduce((n, b) => n + b.pages, 0);
  const rated = finished.filter((b) => b.rating);
  const avg = rated.length ? rated.reduce((n, b) => n + b.rating!, 0) / rated.length : 0;
  const expected = (reader.goal * dayOfYear(TODAY)) / 365;
  const delta = Math.round(finished.length - expected); // positive = ahead
  const genres = Object.entries(finished.reduce<Record<string, number>>((m, b) => ({ ...m, [b.genre]: (m[b.genre] ?? 0) + 1 }), {})).sort((a, b) => b[1] - a[1]);
  const remaining = reader.goal - finished.length;
  const daysLeft = 365 - dayOfYear(TODAY);
  const perWeekNeeded = remaining > 0 ? (remaining / daysLeft) * 7 : 0;
  return { finished, perMonth, pages, avg, expected, delta, genres, remaining, perWeekNeeded, longest: [...finished].sort((a, b) => b.pages - a.pages)[0] };
}

/** Local library state shared by all three reader concepts. No backend. */
export function useLibrary() {
  const [books, setBooks] = useState<Book[]>(initialBooks);

  const update = useCallback((id: string, patch: Partial<Book>) => setBooks((bs) => bs.map((b) => (b.id === id ? { ...b, ...patch } : b))), []);

  /** Returns true when the update finished the book. */
  const setProgress = useCallback((id: string, pages: number) => {
    const b = books.find((x) => x.id === id);
    if (!b) return false;
    const p = Math.max(0, Math.min(pages, b.pages));
    if (p >= b.pages) { update(id, { shelf: 'read', progress: undefined, finished: TODAY }); return true; }
    update(id, { progress: p });
    return false;
  }, [books, update]);

  const moveShelf = useCallback((id: string, shelf: Shelf) => {
    update(id, shelf === 'read' ? { shelf, finished: TODAY, progress: undefined } : shelf === 'reading' ? { shelf, finished: undefined, progress: books.find((b) => b.id === id)?.progress ?? 0 } : { shelf, finished: undefined });
  }, [books, update]);

  const rate = useCallback((id: string, rating: number) => update(id, { rating }), [update]);
  const stats = useMemo(() => computeStats(books), [books]);
  return { books, stats, setProgress, moveShelf, rate };
}

export const byShelf = (books: Book[], s: Shelf) => books.filter((b) => b.shelf === s);
export const fmtDate = (iso: string) => new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
