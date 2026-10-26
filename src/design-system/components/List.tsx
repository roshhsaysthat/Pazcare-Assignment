import type { KeyboardEvent, ReactNode } from 'react';

/** Hairline list. ArrowUp/ArrowDown/Home/End move focus between rows. */
export function List({ label, children, className = '' }: { label: string; children: ReactNode; className?: string }) {
  const onKey = (e: KeyboardEvent<HTMLUListElement>) => {
    const keys = ['ArrowDown', 'ArrowUp', 'Home', 'End'];
    if (!keys.includes(e.key)) return;
    const rows = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('button.ds-row'));
    const i = rows.indexOf(document.activeElement as HTMLElement);
    if (i < 0) return;
    e.preventDefault();
    const next = e.key === 'Home' ? 0 : e.key === 'End' ? rows.length - 1 : e.key === 'ArrowDown' ? Math.min(i + 1, rows.length - 1) : Math.max(i - 1, 0);
    rows[next].focus();
  };
  return (
    <ul className={`ds-list ${className}`.trim()} aria-label={label} onKeyDown={onKey}>
      {children}
    </ul>
  );
}

type RowProps = {
  title: ReactNode;
  description?: ReactNode;
  leading?: ReactNode;
  meta?: ReactNode;
  trailing?: ReactNode;
  current?: boolean;
  onClick?: () => void;
};

export function ListRow({ title, description, leading, meta, trailing, current, onClick }: RowProps) {
  const inner = (
    <>
      {leading}
      <span className="ds-row__body">
        <span className="ds-row__title">{title}</span>
        {description && <span className="ds-row__desc">{description}</span>}
      </span>
      {meta && <span className="ds-row__meta">{meta}</span>}
      {trailing}
    </>
  );
  // Only rows that DO something are buttons. A static row must not be a dead tab stop.
  return (
    <li>
      {onClick ? (
        <button type="button" className="ds-row" aria-current={current ? 'true' : undefined} onClick={onClick}>{inner}</button>
      ) : (
        <div className="ds-row ds-row--static">{inner}</div>
      )}
    </li>
  );
}
