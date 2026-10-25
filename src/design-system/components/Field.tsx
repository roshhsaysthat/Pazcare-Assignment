import { forwardRef, useId, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';

type Shared = { label: string; hideLabel?: boolean; hint?: string; error?: string };

function wrap(id: string, { label, hideLabel, hint, error }: Shared, control: (describedBy?: string) => JSX.Element) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errId = error ? `${id}-err` : undefined;
  const describedBy = [hintId, errId].filter(Boolean).join(' ') || undefined;
  return (
    <div className="ds-field">
      <label htmlFor={id} className={hideLabel ? 'ds-sr-only' : 'ds-field__label'}>{label}</label>
      {control(describedBy)}
      {hint && <span id={hintId} className="ds-field__hint">{hint}</span>}
      {error && <span id={errId} className="ds-field__error" role="alert">{error}</span>}
    </div>
  );
}

export const Input = forwardRef<HTMLInputElement, Shared & InputHTMLAttributes<HTMLInputElement>>(function Input({ label, hideLabel, hint, error, ...rest }, ref) {
  const id = useId();
  return wrap(id, { label, hideLabel, hint, error }, (d) => (
    <input ref={ref} id={id} className="ds-input" aria-describedby={d} aria-invalid={error ? true : undefined} {...rest} />
  ));
});

export const Textarea = forwardRef<HTMLTextAreaElement, Shared & TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea({ label, hideLabel, hint, error, ...rest }, ref) {
  const id = useId();
  return wrap(id, { label, hideLabel, hint, error }, (d) => (
    <textarea ref={ref} id={id} className="ds-input" aria-describedby={d} aria-invalid={error ? true : undefined} {...rest} />
  ));
});
