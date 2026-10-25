import { Fragment, type ReactNode } from 'react';
import { people } from './data';

const mentionNames = people.map((p) => p.name).join('|');
const re = new RegExp(`(\\*\\*[^*]+\\*\\*|\`[^\`]+\`|@(?:${mentionNames}))`, 'g');

/** Tiny inline formatter: **bold**, *italic* is intentionally skipped, `code`, @Mentions. Output is React nodes, never raw HTML. */
export function rich(text: string): ReactNode {
  return text.split(re).map((part, i) => {
    if (part.startsWith('**')) return <strong key={i} style={{ fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('`')) return <code key={i} className="msg-code">{part.slice(1, -1)}</code>;
    if (part.startsWith('@')) return <span key={i} className="msg-mention">{part}</span>;
    return <Fragment key={i}>{part}</Fragment>;
  });
}
