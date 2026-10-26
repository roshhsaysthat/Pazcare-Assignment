import { useState, type FormEvent } from 'react';
import { BookOpen, Plus } from '@phosphor-icons/react';
import { Avatar, Banner, Button, Card, Input, List, ListRow, Meter, Sheet, Tag } from '../../design-system';
import { byShelf, fmtDate, useLibrary } from './library';
import { reader, SHELVES, SHELF_LABEL, type Book, type Shelf } from './data';
import { Cover, Stars } from './shared';
import './reader.css';
import './now.css';

function ProgressForm({ book, onSave }: { book: Book; onSave: (pages: number) => void }) {
  const [v, setV] = useState('');
  const n = Number(v);
  const bad = v !== '' && (!Number.isInteger(n) || n < 0 || n > book.pages);
  const submit = (e: FormEvent) => { e.preventDefault(); if (v === '' || bad) return; onSave(n); setV(''); };
  return (
    <form className="now__form" onSubmit={submit} noValidate>
      <Input label={`Page you are on in ${book.title}`} hideLabel inputMode="numeric" placeholder={`Page (of ${book.pages})`} value={v} onChange={(e) => setV(e.target.value)} error={bad ? `Enter a page from 0 to ${book.pages}.` : undefined} />
      <Button type="submit" variant="primary" disabled={v === '' || bad}>Update</Button>
      <Button variant="ghost" icon={<Plus size="1.25em" />} onClick={() => onSave(Math.min((book.progress ?? 0) + 25, book.pages))}>25 pages</Button>
    </form>
  );
}

export default function NowConcept() {
  const lib = useLibrary();
  const { books, stats } = lib;
  const [notice, setNotice] = useState<string | null>(null);
  const [shelf, setShelf] = useState<Shelf | null>(null);
  const [allReviews, setAllReviews] = useState(false);

  const reading = byShelf(books, 'reading');
  const want = byShelf(books, 'want');
  const reviews = books.filter((b) => b.review).sort((a, b) => (b.finished ?? '').localeCompare(a.finished ?? ''));
  const shownReviews = allReviews ? reviews : reviews.slice(0, 3);
  const behind = stats.delta < 0;

  const save = (b: Book, pages: number) => {
    const done = lib.setProgress(b.id, pages);
    setNotice(done ? `Finished ${b.title}. That is ${stats.finished.length + 1} of ${reader.goal} for the year.` : `${b.title} updated to page ${Math.min(pages, b.pages)}.`);
  };

  return (
    <div className="rd now">
      <main className="now__main">
        <header className="now__head">
          <div className="rd__avatar-row"><Avatar name={reader.name} size={56} /><div><p className="ds-muted">@{reader.handle} · reading since {reader.since}</p></div></div>
          <h1 className="rd-title"><span className="ds-soft">{reader.name},</span><br />{reading.length === 0 ? 'between books.' : `reading ${reading.length === 1 ? 'one book' : `${reading.length} books`}.`}</h1>
          <p className="ds-muted now__bio">{reader.bio}</p>
        </header>

        {notice && <Banner onDismiss={() => setNotice(null)}>{notice}</Banner>}

        <section aria-labelledby="reading-h">
          <h2 id="reading-h" className="rd-label">Currently reading</h2>
          {reading.length === 0 ? (
            <Card variant="flat" size="lg" className="now__empty">
              <p><strong>Nothing on the nightstand.</strong> Pick one from your want-to-read shelf.</p>
              <ul className="now__picks">
                {want.slice(0, 3).map((b) => (
                  <li key={b.id}><Cover book={b} width={56} /><span><strong>{b.title}</strong><br /><span className="ds-muted">{b.author}</span></span><Button size="sm" variant="primary" onClick={() => { lib.moveShelf(b.id, 'reading'); setNotice(`Started ${b.title}.`); }}>Start</Button></li>
                ))}
              </ul>
            </Card>
          ) : (
            <ul className="now__reads">
              {reading.map((b) => {
                const pct = Math.round(((b.progress ?? 0) / b.pages) * 100);
                return (
                  <li key={b.id}>
                    <Card variant="tint" tint={b.tint} size="xl" className="now__read">
                      <Cover book={b} width={112} />
                      <div className="now__read-body">
                        <div><h3 className="now__book">{b.title}</h3><p>{b.author}</p></div>
                        <div className="pagebar">
                          <Meter value={b.progress ?? 0} max={b.pages} label={`Progress in ${b.title}`} />
                          <div className="pagebar__meta"><span>{pct}% read</span><span>{b.pages - (b.progress ?? 0)} pages to go</span></div>
                        </div>
                        <ProgressForm book={b} onSave={(p) => save(b, p)} />
                      </div>
                    </Card>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section aria-labelledby="reviews-h">
          <h2 id="reviews-h" className="rd-label">Recent reviews</h2>
          <ul className="now__reviews">
            {shownReviews.map((b) => (
              <li key={b.id} className="now__review">
                <Cover book={b} width={56} />
                <div>
                  <p className="now__review-top"><strong>{b.title}</strong> <Stars value={b.rating ?? 0} /> <time className="ds-muted" dateTime={b.finished}>{b.finished && fmtDate(b.finished)}</time></p>
                  <p className="now__quote">{b.review}</p>
                </div>
              </li>
            ))}
          </ul>
          {reviews.length > 3 && <Button variant="secondary" aria-expanded={allReviews} onClick={() => setAllReviews((a) => !a)}>{allReviews ? 'Show fewer' : `Show all ${reviews.length} reviews`}</Button>}
        </section>
      </main>

      <aside className="now__rail" aria-label="Challenge and shelves">
        <Card variant="inverse" size="xl" className="now__challenge">
          <h2 className="rd-label now__on-dark">2026 reading challenge</h2>
          <p className="now__big">{stats.finished.length}<span> of {reader.goal} books</span></p>
          <Meter value={stats.finished.length} max={reader.goal} label="Books read toward the 2026 goal" />
          <p className="now__pace">
            {behind ? <Tag tone="signal" dot>{Math.abs(stats.delta)} {Math.abs(stats.delta) === 1 ? 'book' : 'books'} behind pace</Tag> : <Tag tone="success" dot>On pace</Tag>}
          </p>
          {stats.remaining > 0 && <p className="now__on-dark">About {stats.perWeekNeeded.toFixed(1)} books a week finishes the year.</p>}
        </Card>

        <section aria-labelledby="shelves-h">
          <h2 id="shelves-h" className="rd-label">Shelves</h2>
          <List label="Shelves">
            {SHELVES.map((s) => (
              <ListRow key={s} leading={<BookOpen size="1.25em" aria-hidden="true" />} title={SHELF_LABEL[s]} trailing={<span className="ds-muted">{books.filter((b) => b.shelf === s).length}</span>} onClick={() => setShelf(s)} />
            ))}
          </List>
        </section>
      </aside>

      <Sheet open={!!shelf} onClose={() => setShelf(null)} title={shelf ? SHELF_LABEL[shelf] : 'Shelf'} side="right">
        {shelf && (
          <List label={SHELF_LABEL[shelf]}>
            {books.filter((b) => b.shelf === shelf).map((b) => <ListRow key={b.id} leading={<Cover book={b} width={36} />} title={b.title} description={b.author} trailing={b.rating ? <Stars value={b.rating} /> : undefined} />)}
          </List>
        )}
      </Sheet>
    </div>
  );
}
