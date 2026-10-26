import { useMemo, useState } from 'react';
import { Avatar, Button, FilterTag, Meter, Sheet, Tag, Textarea } from '../../design-system';
import { fmtDate, useLibrary } from './library';
import { reader, SHELF_LABEL, SHELVES, type Book, type Shelf } from './data';
import { Cover, RatingInput, Stars } from './shared';
import './reader.css';
import './shelves.css';

type Sort = 'recent' | 'title' | 'rating' | 'pages';
const SORTS: [Sort, string][] = [['recent', 'Recently finished'], ['title', 'Title'], ['rating', 'Rating'], ['pages', 'Length']];

function Detail({ book, lib, onClose }: { book: Book; lib: ReturnType<typeof useLibrary>; onClose: () => void }) {
  const [draft, setDraft] = useState(book.review ?? '');
  const [page, setPage] = useState('');
  const saved = draft.trim() === (book.review ?? '');
  return (
    <div className="sh-detail">
      <div className="sh-detail__top">
        <Cover book={book} width={120} />
        <div>
          <h3 className="sh-detail__title">{book.title}</h3>
          <p>{book.author}</p>
          <p className="ds-muted">{book.genre} · {book.pages} pages{book.finished ? ` · finished ${fmtDate(book.finished)}` : ''}</p>
          {book.rating ? <p><Stars value={book.rating} /></p> : null}
        </div>
      </div>

      <label className="sh-field"><span className="sh-field__label">Shelf</span>
        <select className="ds-input" value={book.shelf} onChange={(e) => lib.moveShelf(book.id, e.target.value as Shelf)}>
          {SHELVES.map((s) => <option key={s} value={s}>{SHELF_LABEL[s]}</option>)}
        </select>
      </label>

      {book.shelf === 'reading' && (
        <div className="sh-field">
          <span className="sh-field__label">Progress</span>
          <Meter value={book.progress ?? 0} max={book.pages} label={`Progress in ${book.title}`} />
          <form className="sh-detail__page" onSubmit={(e) => { e.preventDefault(); const n = Number(page); if (page !== '' && Number.isInteger(n) && n >= 0) { if (lib.setProgress(book.id, n)) onClose(); setPage(''); } }}>
            <input className="ds-input" aria-label="Current page" inputMode="numeric" placeholder={`Page (of ${book.pages})`} value={page} onChange={(e) => setPage(e.target.value)} />
            <Button type="submit" variant="primary" disabled={page === ''}>Update</Button>
          </form>
        </div>
      )}

      <div className="sh-field">
        <span className="sh-field__label">Your rating</span>
        <RatingInput label={`Rate ${book.title}`} value={book.rating ?? 0} onChange={(n) => lib.rate(book.id, n)} />
      </div>

      <div className="sh-field">
        <Textarea label="Your review" hint="Saved to your profile." placeholder="What stayed with you?" value={draft} onChange={(e) => setDraft(e.target.value)} />
        <Button variant="secondary" disabled={saved} onClick={() => lib.setReview(book.id, draft)}>{saved ? 'Saved' : 'Save review'}</Button>
      </div>
    </div>
  );
}

export default function ShelvesConcept() {
  const lib = useLibrary();
  const { books, stats } = lib;
  const [shelf, setShelf] = useState<Shelf | 'all'>('all');
  const [genre, setGenre] = useState('all');
  const [sort, setSort] = useState<Sort>('recent');
  const [openId, setOpenId] = useState<string | null>(null);

  const genres = useMemo(() => [...new Set(books.map((b) => b.genre))].sort(), [books]);
  const shown = useMemo(() => {
    const f = books.filter((b) => (shelf === 'all' || b.shelf === shelf) && (genre === 'all' || b.genre === genre));
    const cmp: Record<Sort, (a: Book, b: Book) => number> = {
      recent: (a, b) => (b.finished ?? '0').localeCompare(a.finished ?? '0'),
      title: (a, b) => a.title.localeCompare(b.title),
      rating: (a, b) => (b.rating ?? 0) - (a.rating ?? 0),
      pages: (a, b) => b.pages - a.pages,
    };
    return [...f].sort(cmp[sort]);
  }, [books, shelf, genre, sort]);
  const open = books.find((b) => b.id === openId) ?? null;

  return (
    <div className="rd sh">
      <header className="sh__head">
        <div className="sh__who">
          <Avatar name={reader.name} size={56} />
          <div>
            <h1 className="rd-title"><span className="ds-soft">{reader.name},</span> <span className="sh__bookcount">{books.length} books on the shelf.</span></h1>
            <p className="ds-muted">{reader.bio}</p>
          </div>
        </div>
        <div className="sh__goal">
          <span className="sh__goal-label">2026 challenge</span>
          <Meter value={stats.finished.length} max={reader.goal} label="Books read toward the 2026 goal" />
          {stats.delta < 0 ? <Tag tone="signal" dot>{Math.abs(stats.delta)} behind pace</Tag> : <Tag tone="success" dot>On pace</Tag>}
        </div>
      </header>

      <div className="sh__bar">
        <div role="group" aria-label="Shelf" className="sh__chips">
          <FilterTag pressed={shelf === 'all'} onClick={() => setShelf('all')}>All · {books.length}</FilterTag>
          {SHELVES.map((s) => <FilterTag key={s} pressed={shelf === s} onClick={() => setShelf(s)}>{SHELF_LABEL[s]} · {books.filter((b) => b.shelf === s).length}</FilterTag>)}
        </div>
        <div className="sh__selects">
          <label className="sh__select"><span className="ds-muted">Genre</span>
            <select className="ds-input" value={genre} onChange={(e) => setGenre(e.target.value)}><option value="all">All genres</option>{genres.map((g) => <option key={g}>{g}</option>)}</select>
          </label>
          <label className="sh__select"><span className="ds-muted">Sort</span>
            <select className="ds-input" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>{SORTS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
          </label>
        </div>
      </div>

      <p role="status" className="ds-muted sh__count">Showing {shown.length} {shown.length === 1 ? 'book' : 'books'}</p>

      {shown.length === 0 ? (
        <p className="sh__empty ds-muted">No books match. Try another shelf or genre.</p>
      ) : (
        <ul className="sh__grid" aria-label="Books">
          {shown.map((b) => (
            <li key={b.id}>
              <button type="button" className="sh__book" onClick={() => setOpenId(b.id)} aria-label={`${b.title} by ${b.author}. ${SHELF_LABEL[b.shelf]}. Open details`}>
                <Cover book={b} width={140} fluid />
                <span className="sh__book-meta">
                  {b.shelf === 'reading' ? <Meter value={b.progress ?? 0} max={b.pages} label={`Progress in ${b.title}`} display={`${Math.round(((b.progress ?? 0) / b.pages) * 100)}%`} /> : b.rating ? <Stars value={b.rating} /> : <span className="ds-muted">{b.pages} pages</span>}
                  {b.review && <Tag>Reviewed</Tag>}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <Sheet open={!!open} onClose={() => setOpenId(null)} title={open?.title ?? 'Book'} side="right">
        {open && <Detail key={open.id} book={open} lib={lib} onClose={() => setOpenId(null)} />}
      </Sheet>
    </div>
  );
}
