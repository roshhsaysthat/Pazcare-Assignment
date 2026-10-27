import type { ReactNode } from 'react';
import { X } from '@phosphor-icons/react';
import { Button } from './Button';

/** Inline status message. The system has no toast: use this with role="status" and a dismiss button. */
export function Banner({ children, onDismiss }: { children: ReactNode; onDismiss?: () => void }) {
  return (
    <div className="ds-banner" role="status">
      <div className="ds-banner__text">{children}</div>
      {onDismiss && <Button variant="ghost" size="sm" iconOnly aria-label="Dismiss" icon={<X size="1.25em" />} onClick={onDismiss} />}
    </div>
  );
}
