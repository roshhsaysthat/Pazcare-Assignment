import { useMemo, useState, type ReactNode } from 'react';
import { Check, Plus } from '@phosphor-icons/react';
import { Button, FilterTag, Input, Sheet, Tag } from '../../design-system';
import type { Book } from './data';
import { catalogue } from './data';
import type { useLibrary } from './library';
import { Cover } from './shared';
import './explore.css';

type Lib = ReturnType<typeof useLibrary>;

/**
 * Explore: recommendations from what the reader has read, plus search by title, author or genre.
 * Recommendation rule (inferred, deliberately simple): each finished or current book adds its rating (3 if unrated)
 * to its genre; unseen books are ranked by their genre's score. DNF books count for nothing.
 */
export type Pick = { book: Omit<Book, 'shelf'>; because: string };

/** Each concept supplies its own entry point through `children`; the sheet itself is shared. */
export function Explore({ lib, children }: { lib: Lib; children: (open: () => void, top?: Pick) => ReactNode }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [genre, setGenre] = useState('all');
  const { books, addBook } = lib;

  const owned = useMemo(() => new Set(books.map((b) => b.id)), [books]);
  const genres = useMemo(() => [...new Set(catalogue.map((b) => b.genre))].sort(), []);
  const affinity = useMemo(() => {
    const m: Record<string, number> = {};
    books.filter((b) => b.shelf === 'read' || b.shelf === 'reading').forEach((b) => { m[b.genre] = (m[b.genre] ?? 0) + (b.rating ?? 3); });
    return m;
  }, [books]);
  const readCount = (g: string) => books.filter((b) => b.genre === g && (b.shelf === 'read' || b.shelf === 'reading')).length;

  const searching = q.trim() !== '' || genre !== 'all';
  const term = q.trim().toLowerCase();
  const recs = useMemo(() => catalogue.filter((b) => !owned.has(b.id) && (affinity[b.genre] ?? 0) > 0).sort((a, b) => (affinity[b.genre] ?? 0) - (affinity[a.genre] ?? 0)).slice(0, 6), [owned, affinity]);
  const results = useMemo(() => {
    const pool = catalogue.filter((b) => (genre === 'all' || b.genre === genre) && (!term || [b.title, b.author, b.genre].some((t) => t.toLowerCase().includes(term))));
    return searching ? pool : recs;
  }, [term, genre, searching, recs]);
  const top: Pick | undefined = recs[0] && { book: recs[0], because: `Because you read ${readCount(recs[0].genre)} ${recs[0].genre}` };

  return (
    <>
      {children(() => setOpen(true), top)}
      <Sheet open={open} onClose={() => setOpen(false)} title="Explore books" side="right">
        <div className="ex">
          <Input label="Search by title, author or genre" type="search" placeholder="Try Le Guin, Fantasy or Hyperion" value={q} onChange={(e) => setQ(e.target.value)} />
          <div role="group" aria-label="Genre" className="ex__chips">
            <FilterTag pressed={genre === 'all'} onClick={() => setGenre('all')}>All</FilterTag>
            {genres.map((g) => <FilterTag key={g} pressed={genre === g} onClick={() => setGenre(g)}>{g}</FilterTag>)}
          </div>
          <h3 className="ex__h">{searching ? 'Results' : 'Picked for you'}</h3>
          <p className="ds-muted" role="status">{searching ? `${results.length} ${results.length === 1 ? 'book' : 'books'} found` : 'Based on the genres you read and rate most.'}</p>
          {results.length === 0 ? <p className="ds-muted">Nothing matches. Try a different word or genre.</p> : (
            <ul className="ex__list" aria-label={searching ? 'Search results' : 'Recommendations'}>
              {results.map((b) => {
                const have = owned.has(b.id);
                return (
                  <li key={b.id} className="ex__row">
                    <Cover book={{ ...b, shelf: 'want' }} width={56} />
                    <div className="ex__info">
                      <strong>{b.title}</strong>
                      <span>{b.author}</span>
                      <span className="ds-muted">{b.genre} · {b.pages} pages</span>
                      {!searching && <Tag>Because you read {readCount(b.genre)} {b.genre}</Tag>}
                    </div>
                    {have
                      ? <Button size="sm" variant="ghost" disabled icon={<Check size="1.25em" />} aria-label={`${b.title} is on your shelf`}>On shelf</Button>
                      : <Button size="sm" variant="secondary" icon={<Plus size="1.25em" />} aria-label={`Add ${b.title} to want to read`} onClick={() => addBook(b)}>Want to read</Button>}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </Sheet>
    </>
  );
}
