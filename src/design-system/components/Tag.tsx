import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { tintVar, type Tint } from '../tints';

type Tone = 'neutral' | 'signal' | 'success' | 'danger' | 'info';
type TagProps = { tone?: Tone; dot?: boolean; tint?: Tint; children: ReactNode };

/** Static label. Status tones always show a dot plus text, never colour alone. */
export function Tag({ tone = 'neutral', dot, tint, children }: TagProps) {
  const cls = `ds-tag ds-tag--${tone}${tint ? ' ds-tag--tint' : ''}`;
  return (
    <span className={cls} style={tint ? { ['--tint' as string]: tintVar(tint) } : undefined}>
      {dot && <span className="ds-tag__dot" aria-hidden="true" />}
      {children}
    </span>
  );
}

/** Filter chip: a toggle button with aria-pressed. Selected = ink fill. */
export function FilterTag({ pressed, children, ...rest }: { pressed: boolean; children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className="ds-tag" aria-pressed={pressed} {...rest}>
      {children}
    </button>
  );
}
