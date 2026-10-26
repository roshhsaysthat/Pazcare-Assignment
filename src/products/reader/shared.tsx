import { useId } from 'react';
import { Star } from '@phosphor-icons/react';
import { tintVar } from '../../design-system';
import type { Book } from './data';

/** Generated cover: original typography on a tint. No real cover art is used. */
export function Cover({ book, width = 96 }: { book: Book; width?: number }) {
  return (
    <div className="cover" role="img" aria-label={`Cover of ${book.title} by ${book.author}`} style={{ width, ['--tint' as string]: tintVar(book.tint) }}>
      <span className="cover__title" style={{ fontSize: Math.max(10, width * 0.15) }}>{book.title}</span>
      <span className="cover__author" style={{ fontSize: Math.max(8, width * 0.095) }}>{book.author}</span>
    </div>
  );
}

/** Read-only rating. Announced as text, never colour alone. */
export function Stars({ value, size = '1em' }: { value: number; size?: string }) {
  return (
    <span className="stars" role="img" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => <Star key={n} size={size} weight={n <= value ? 'fill' : 'regular'} aria-hidden="true" />)}
    </span>
  );
}

/** Native radio group, so arrow keys and screen readers work for free. */
export function RatingInput({ value, onChange, label }: { value: number; onChange: (n: number) => void; label: string }) {
  const name = useId();
  return (
    <fieldset className="rating-input">
      <legend className="ds-sr-only">{label}</legend>
      {[1, 2, 3, 4, 5].map((n) => (
        <label key={n} className="rating-input__star" data-on={n <= value || undefined}>
          <input type="radio" name={name} className="ds-sr-only" checked={value === n} onChange={() => onChange(n)} />
          <Star size="1.5em" weight={n <= value ? 'fill' : 'regular'} aria-hidden="true" />
          <span className="ds-sr-only">{n} {n === 1 ? 'star' : 'stars'}</span>
        </label>
      ))}
    </fieldset>
  );
}
