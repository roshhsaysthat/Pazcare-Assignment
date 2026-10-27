import type { ReactNode, CSSProperties } from 'react';
import { tintVar, type Tint } from '../tints';

type Props = {
  variant?: 'outline' | 'tint' | 'inverse' | 'flat';
  tint?: Tint;
  size?: 'dense' | 'md' | 'lg' | 'xl';
  as?: 'div' | 'article' | 'section' | 'li';
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

/** Surface. Tint cards identify content (a channel, a person), they are not decoration. */
export function Card({ variant = 'outline', tint = 'ice', size = 'md', as: Tag = 'div', className = '', style, children }: Props) {
  const sz = size === 'md' ? '' : ` ds-card--${size}`;
  return (
    <Tag className={`ds-card ds-card--${variant}${sz} ${className}`.trim()} style={variant === 'tint' ? { ['--tint' as string]: tintVar(tint), ...style } : style}>
      {children}
    </Tag>
  );
}
