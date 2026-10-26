import { useEffect, useRef, useState } from 'react';
import { MONTHS, reader, TODAY } from './data';
import type { computeStats } from './library';

type Stats = ReturnType<typeof computeStats>;
export type Mode = 'progress' | 'pages';
const now = Number(TODAY.slice(5, 7)) - 1; // index of the current month

/** Hand-built SVG chart sized to its container so text stays 12px at every width. Ink for actuals, soft grey for target. */
export function YearChart({ stats, mode }: { stats: Stats; mode: Mode }) {
  const box = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(640);
  useEffect(() => {
    const el = box.current; if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(280, Math.round(e.contentRect.width))));
    ro.observe(el); setW(Math.max(280, el.clientWidth || 640));
    return () => ro.disconnect();
  }, []);

  const h = 260, m = { l: 36, r: 28, t: 20, b: 32 };
  const pw = w - m.l - m.r, ph = h - m.t - m.b;
  const x = (i: number) => m.l + (pw * (i + 0.5)) / 12;
  const narrow = w < 480;

  const cum = stats.perMonth.map((_, i) => stats.perMonth.slice(0, i + 1).reduce((n, b) => n + b.length, 0));
  const pages = stats.perMonth.map((bs) => bs.reduce((n, b) => n + b.pages, 0));
  const yMax = mode === 'progress' ? reader.goal : Math.ceil(Math.max(...pages) / 500) * 500;
  const y = (v: number) => m.t + ph - (ph * v) / yMax;
  const ticks = mode === 'progress' ? [0, 5, 10, 15, 20] : [0, yMax / 2, yMax];
  const target = (i: number) => (reader.goal * (i + 1)) / 12;

  const summary = mode === 'progress'
    ? `Line chart. ${cum[now]} books read by ${MONTHS[now]} against an expected ${Math.round(stats.expected)}. Goal ${reader.goal}.`
    : `Bar chart of pages read per month. Busiest month ${MONTHS[pages.indexOf(Math.max(...pages))]} with ${Math.max(...pages)} pages.`;

  return (
    <div ref={box} className="yc">
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={summary}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={m.l} x2={w - m.r} y1={y(t)} y2={y(t)} stroke="var(--ds-border)" />
            <text x={m.l - 8} y={y(t) + 4} textAnchor="end" className="yc__tick">{t}</text>
          </g>
        ))}
        {MONTHS.map((mo, i) => (
          <text key={mo} x={x(i)} y={h - 10} textAnchor="middle" className="yc__tick" data-now={i === now || undefined}>{narrow ? mo[0] : mo}</text>
        ))}
        {mode === 'progress' ? (
          <>
            <polyline fill="none" stroke="var(--ds-text-muted)" strokeWidth="2" strokeDasharray="5 5" points={MONTHS.map((_, i) => `${x(i)},${y(target(i))}`).join(' ')} />
            <text x={w - m.r} y={y(reader.goal) - 6} textAnchor="end" className="yc__label yc__label--soft">Target pace</text>
            <polyline fill="none" stroke="var(--ds-text)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" points={cum.slice(0, now + 1).map((v, i) => `${x(i)},${y(v)}`).join(' ')} />
            {cum.slice(0, now + 1).map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r={i === now ? 5 : 3} fill="var(--ds-text)" />)}
            <text x={x(now)} y={y(cum[now]) + 22} textAnchor="middle" className="yc__label">{cum[now]} read</text>
            <text x={x(now) - 12} y={y(target(now)) - 8} textAnchor="end" className="yc__label yc__label--soft">{Math.round(stats.expected)} expected</text>
          </>
        ) : (
          <>
            {pages.map((v, i) => i <= now && (
              <g key={i}>
                <rect x={x(i) - (pw / 12) * 0.32} y={y(v)} width={(pw / 12) * 0.64} height={Math.max(0, y(0) - y(v))} rx="5" fill={v === Math.max(...pages) ? 'var(--ds-text)' : 'var(--ds-text-muted)'} />
                {!narrow && v > 0 && <text x={x(i)} y={y(v) - 6} textAnchor="middle" className="yc__label">{v}</text>}
              </g>
            ))}
          </>
        )}
      </svg>
      <table className="ds-sr-only">
        <caption>{mode === 'progress' ? 'Books read, cumulative, by month' : 'Pages read by month'}</caption>
        <thead><tr><th>Month</th><th>{mode === 'progress' ? 'Books so far' : 'Pages'}</th></tr></thead>
        <tbody>{MONTHS.slice(0, now + 1).map((mo, i) => <tr key={mo}><td>{mo}</td><td>{mode === 'progress' ? cum[i] : pages[i]}</td></tr>)}</tbody>
      </table>
    </div>
  );
}
