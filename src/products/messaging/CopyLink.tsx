import { useEffect, useState } from 'react';
import { Check, Link as LinkIcon } from '@phosphor-icons/react';
import { Button } from '../../../design-system';

// The team is fictional, so these links are examples of the shape a real product would share.
const BASE = 'https://northfield.design';
export const channelLink = (name: string) => `${BASE}/c/${name}`;
export const inviteLink = (title: string) => `${BASE}/meet/${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;

async function copy(text: string) {
  try { await navigator.clipboard.writeText(text); return true; } catch { /* fall back below */ }
  try {
    const t = document.createElement('textarea');
    t.value = text; t.setAttribute('readonly', ''); t.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(t); t.select();
    const ok = document.execCommand('copy'); t.remove();
    return ok;
  } catch { return false; }
}

type Props = { url: string; label: string; text?: string; variant?: 'ghost' | 'secondary'; size?: 'sm' | 'md' };

/** Copies a link. Icon-only when `text` is omitted. Says so on screen and to screen readers, and shows the link if the browser refuses to copy. */
export function CopyLink({ url, label, text, variant = 'ghost', size = 'md' }: Props) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  useEffect(() => { if (state === 'idle') return; const t = setTimeout(() => setState('idle'), state === 'failed' ? 6000 : 2000); return () => clearTimeout(t); }, [state]);
  const icon = state === 'copied' ? <Check size="1.25em" aria-hidden="true" /> : <LinkIcon size="1.25em" aria-hidden="true" />;
  const onClick = async () => setState((await copy(url)) ? 'copied' : 'failed');
  return (
    <span className="copylink">
      {text ? (
        <Button variant={variant} size={size} icon={icon} onClick={onClick}>{state === 'copied' ? 'Link copied' : text}</Button>
      ) : (
        <Button variant={variant} size={size} iconOnly aria-label={label} icon={icon} onClick={onClick} />
      )}
      {state === 'failed' && <span className="copylink__fail">{url}</span>}
      <span className="ds-sr-only" role="status">{state === 'copied' ? 'Link copied' : state === 'failed' ? `Could not copy. The link is ${url}` : ''}</span>
    </span>
  );
}
