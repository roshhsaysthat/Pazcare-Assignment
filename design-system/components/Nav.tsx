import type { ReactNode } from 'react';

export type NavItem = { id: string; label: string; icon?: ReactNode; badge?: number; badgeLabel?: string };
type Props = {
  label: string; // landmark label is required
  items: NavItem[];
  current: string;
  onSelect: (id: string) => void;
  variant?: 'pill' | 'stack' | 'rail';
  heading?: string;
};

/** Navigation landmark. pill = floating (labels hide under 640px), stack = sectioned list, rail = icon-only. */
export function Nav({ label, items, current, onSelect, variant = 'stack', heading }: Props) {
  return (
    <nav className={`ds-nav ds-nav--${variant}`} aria-label={label} style={variant !== 'pill' ? { display: 'block' } : undefined}>
      {heading && <div className="ds-nav__heading">{heading}</div>}
      <ul>
        {items.map((it) => (
          <li key={it.id} style={variant === 'stack' ? undefined : undefined}>
            <button
              type="button"
              className="ds-nav__item"
              aria-current={it.id === current ? 'page' : undefined}
              aria-label={variant === 'rail' ? it.label : undefined}
              onClick={() => onSelect(it.id)}
            >
              {it.icon}
              {variant !== 'rail' && <span className="ds-nav__label">{it.label}</span>}
              {it.badge ? <span className="ds-nav__badge" aria-label={it.badgeLabel ?? `${it.badge} unread`}>{it.badge}</span> : null}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
