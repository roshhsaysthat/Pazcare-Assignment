import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Common = {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
};
type WithLabel = Common & { iconOnly?: false; 'aria-label'?: string };
type IconOnly = Common & { iconOnly: true; 'aria-label': string };
export type ButtonProps = (WithLabel | IconOnly) & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'>;

/** Pill button. Icon-only buttons must carry an aria-label (enforced by the type). */
export function Button({ variant = 'secondary', size = 'md', icon, iconOnly, className = '', children, type = 'button', ...rest }: ButtonProps) {
  const cls = `ds-btn ds-btn--${variant} ds-btn--${size}${iconOnly ? ' ds-btn--icon' : ''} ${className}`.trim();
  return (
    <button type={type} className={cls} {...rest}>
      {icon}
      {iconOnly ? null : children}
    </button>
  );
}
