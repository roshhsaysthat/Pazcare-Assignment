import { useState } from 'react';
import { Avatar, Button, Card, FilterTag, List, ListRow, Meter, Tag } from '../../design-system';
import { byShelf, fmtDate, useLibrary } from './library';
import { MONTHS, reader, SHELVES, SHELF_LABEL } from './data';
import { Cover, Stars } from './shared';
import { Explore } from './Explore';
import { YearChart, type Mode } from './YearChart';
import './reader.css';
import './year.css';

function Stat({ label, value, sub }: { label: string; value: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div className="stat">
      <dt className="stat__label">{label}</dt>
      <dd className="stat__value">{value}</dd>
      {sub && <dd className="stat__sub">{sub}</dd>}
    </div>
  );
}

export default function YearConcept() {
  const lib = useLibrary();
  const { books, stats } = lib;
  const [mode, setMode] = useState<Mode>('progress');
  const [month, setMonth] = useState('all');
  const behind = stats.delta < 0;
  const reading = byShelf(books, 'reading');
  const topReview = [...books].filter((b) => b.review && b.rating === 5).sort((a, b) => (b.finished ?? '').localeCompare(a.finished ?? ''))[0];
  const finished = [...stats.finished].sort((a, b) => b.finished!.localeCompare(a.finished!)).filter((b) => month === 'all' || Number(b.finished!.slice(5, 7)) === Number(month));
  const maxGenre = stats.genres[0]?.[1] ?? 1;

  return (
    <div className="rd year">
      <header className="year__head">
        <div className="rd__avatar-row"><Avatar name={reader.name} size={40} /><p className="ds-muted"><strong>{reader.name}</strong> · @{reader.handle}</p></div>
        <h1 className="rd-title"><span className="ds-soft">2026 so far,</span><br />{stats.finished.length} books and {stats.pages.toLocaleString('en-GB')} pages.</h1>
      </header>

      <dl className="year__stats" aria-label="2026 reading statistics">
        <Stat label="Books read" value={`${stats.finished.length}`} sub={`of ${reader.goal} goal`} />
        <Stat label="Pages read" value={stats.pages.toLocaleString('en-GB')} sub={stats.longest && `Longest: ${stats.longest.title}`} />
        <Stat label="Average rating" value={stats.avg.toFixed(1)} sub={<Stars value={Math.round(stats.avg)} />} />
        <Stat label="Pace" value={behind ? `${Math.abs(stats.delta)} behind` : 'On pace'} sub={<>{behind ? <Tag tone="signal" dot>Behind pace</Tag> : <Tag tone="success" dot>On or ahead</Tag>}{stats.remaining > 0 && <span className="stat__note">Needs {stats.perWeekNeeded.toFixed(1)} books a week</span>}</>} />
      </dl>

      <Explore lib={lib}>{(open) => (
        <Card variant="tint" tint="butter" size="lg" className="ex-next year__gap">
          <div className="ex-next__text"><p className="ex-next__kicker">{stats.remaining > 0 ? 'Closing the gap' : 'Goal reached'}</p><h2 className="ex-next__title">{stats.remaining > 0 ? `${stats.remaining} ${stats.remaining === 1 ? 'book' : 'books'} to reach ${reader.goal}.` : `You hit ${reader.goal}. Keep going.`}</h2><p>Short reads in genres you rate highly get you there fastest.</p></div>
          <Button variant="primary" onClick={open}>{stats.remaining > 0 ? `Find ${stats.remaining === 1 ? 'the last one' : 'books for the goal'}` : 'Find more books'}</Button>
        </Card>
      )}</Explore>

      <div className="year__grid">
        <Card size="xl" className="year__chart">
          <div className="year__chart-head">
            <h2 className="year__h2">{mode === 'progress' ? 'Progress against your goal' : 'Pages per month'}</h2>
            <div role="group" aria-label="Chart view" className="year__toggle">
              <FilterTag pressed={mode === 'progress'} onClick={() => setMode('progress')}>Progress</FilterTag>
              <FilterTag pressed={mode === 'pages'} onClick={() => setMode('pages')}>Pages</FilterTag>
            </div>
          </div>
          <YearChart stats={stats} mode={mode} />
        </Card>

        <Card variant="flat" size="xl" className="year__genres">
          <h2 className="year__h2">What you read</h2>
          <ul className="year__genre-list">
            {stats.genres.map(([g, n]) => (
              <li key={g}><span>{g}</span><Meter value={n} max={maxGenre} label={`${g} books`} display={`${n} ${n === 1 ? 'book' : 'books'}`} /></li>
            ))}
          </ul>
        </Card>

        <section className="year__finished" aria-labelledby="fin-h">
          <div className="year__fin-head">
            <h2 id="fin-h" className="year__h2">Finished this year</h2>
            <label className="year__select"><span className="ds-muted">Month</span>
              <select className="ds-input" value={month} onChange={(e) => setMonth(e.target.value)}>
                <option value="all">All months</option>
                {MONTHS.slice(0, 10).map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
              </select>
            </label>
          </div>
          {finished.length === 0 ? <p className="ds-muted year__empty">Nothing finished in that month.</p> : (
            <List label="Finished books">
              {finished.map((b) => <ListRow key={b.id} leading={<Cover book={b} width={36} />} title={b.title} description={`${b.author} · ${b.pages} pages`} meta={fmtDate(b.finished!)} trailing={<Stars value={b.rating ?? 0} />} />)}
            </List>
          )}
        </section>

        <aside className="year__side" aria-label="Now and shelves">
          <section>
            <h2 className="rd-label">Reading now</h2>
            <ul className="year__now">
              {reading.map((b) => <li key={b.id}><span className="year__now-title">{b.title}</span><Meter value={b.progress ?? 0} max={b.pages} label={`Progress in ${b.title}`} /></li>)}
            </ul>
          </section>
          <section>
            <h2 className="rd-label">Shelves</h2>
            <ul className="year__shelves">
              {SHELVES.map((s) => <li key={s}><Tag>{SHELF_LABEL[s]} · {books.filter((b) => b.shelf === s).length}</Tag></li>)}
            </ul>
          </section>
          {topReview && (
            <Card variant="tint" tint={topReview.tint} size="lg">
              <h2 className="rd-label year__on-tint">Top review of the year</h2>
              <p className="year__quote">“{topReview.review}”</p>
              <p><strong>{topReview.title}</strong> <Stars value={topReview.rating ?? 0} /></p>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}
