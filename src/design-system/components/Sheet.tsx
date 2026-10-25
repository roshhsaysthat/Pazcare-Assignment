import { useEffect, useRef, type ReactNode } from 'react';
import { X } from '@phosphor-icons/react';
import { Button } from './Button';

type Props = {
  open: boolean;
  onClose: () => void;
  title: string; // required: the dialog is labelled by it
  side?: 'center' | 'right' | 'left' | 'bottom';
  footer?: ReactNode;
  children: ReactNode;
};

/** Native <dialog>. Esc and backdrop click close it. Bottom sheet under 640px for side variants. Never stack sheets. */
export function Sheet({ open, onClose, title, side = 'center', footer, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = `sheet-${title.replace(/\W+/g, '-').toLowerCase()}`;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={`ds-sheet ds-sheet--${side}`}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
    >
      <div className="ds-sheet__inner">
        <div className="ds-sheet__head">
          <h2 id={titleId} style={{ fontSize: 'var(--ds-text-title)' }}>{title}</h2>
          <Button variant="ghost" size="sm" iconOnly aria-label="Close" icon={<X size="1.25em" />} onClick={onClose} />
        </div>
        <div className="ds-sheet__body">{open ? children : null}</div>
        {footer && <div className="ds-sheet__foot">{footer}</div>}
      </div>
    </dialog>
  );
}
