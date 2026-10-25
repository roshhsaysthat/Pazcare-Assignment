import { useId, useRef, useState, type KeyboardEvent, type RefObject } from 'react';
import { At, Paperclip, PaperPlaneTilt, TextB, Code, X } from '@phosphor-icons/react';
import { Avatar, Button } from '../../design-system';
import { people } from './data';

type Props = {
  label: string; // accessible name for the textarea
  placeholder: string;
  onSend: (text: string, files: string[]) => void;
  variant?: 'dock' | 'card' | 'pill';
  inputRef?: RefObject<HTMLTextAreaElement>;
  autoFocus?: boolean;
  hint?: string;
};

/**
 * Shared composer. Enter sends, Shift+Enter adds a line. Typing @ opens a mention list
 * (combobox pattern: arrows move, Enter or Tab picks, Esc closes).
 */
export function Composer({ label, placeholder, onSend, variant = 'dock', inputRef, autoFocus, hint }: Props) {
  const own = useRef<HTMLTextAreaElement>(null);
  const ta = inputRef ?? own;
  const fileRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const [text, setText] = useState('');
  const [files, setFiles] = useState<string[]>([]);
  const [active, setActive] = useState(0);
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);

  const matches = mentionQuery === null ? [] : people.filter((p) => !p.bot && p.name.toLowerCase().includes(mentionQuery.toLowerCase())).slice(0, 5);
  const open = matches.length > 0;

  const detect = (value: string, caret: number) => {
    const m = /@([\w ]{0,20})$/.exec(value.slice(0, caret));
    setMentionQuery(m ? m[1] : null);
    setActive(0);
  };

  const wrap = (mark: string) => {
    const el = ta.current; if (!el) return;
    const { selectionStart: s, selectionEnd: e } = el;
    const next = text.slice(0, s) + mark + text.slice(s, e) + mark + text.slice(e);
    setText(next);
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(s + mark.length, e + mark.length); });
  };

  const pick = (name: string) => {
    const el = ta.current; if (!el) return;
    const caret = el.selectionStart;
    const before = text.slice(0, caret).replace(/@([\w ]{0,20})$/, `@${name} `);
    const next = before + text.slice(caret);
    setText(next); setMentionQuery(null);
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(before.length, before.length); });
  };

  const insertAt = () => {
    const el = ta.current; if (!el) return;
    const s = el.selectionStart;
    setText(text.slice(0, s) + '@' + text.slice(s));
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(s + 1, s + 1); detect(text.slice(0, s) + '@', s + 1); });
  };

  const submit = () => {
    const t = text.trim();
    if (!t && files.length === 0) return;
    onSend(t, files);
    setText(''); setFiles([]); setMentionQuery(null);
  };

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (open) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => (a + 1) % matches.length); return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => (a - 1 + matches.length) % matches.length); return; }
      if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); pick(matches[active].name); return; }
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); setMentionQuery(null); return; }
    }
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); submit(); }
  };

  return (
    <div className={`composer composer--${variant}`}>
      {files.length > 0 && (
        <ul className="composer__files" aria-label="Attachments">
          {files.map((f) => (
            <li key={f} className="composer__file">
              <Paperclip size="1em" aria-hidden="true" /> {f}
              <button type="button" aria-label={`Remove ${f}`} onClick={() => setFiles((fs) => fs.filter((x) => x !== f))}><X size="1em" /></button>
            </li>
          ))}
        </ul>
      )}
      <div className="composer__row">
        <textarea
          ref={ta}
          className="composer__input"
          aria-label={label}
          placeholder={placeholder}
          rows={variant === 'card' ? 3 : 1}
          value={text}
          autoFocus={autoFocus}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open ? `${listId}-${active}` : undefined}
          onChange={(e) => { setText(e.target.value); detect(e.target.value, e.target.selectionStart); }}
          onKeyDown={onKey}
        />
        <div className="composer__tools">
          <Button variant="ghost" size="sm" iconOnly aria-label="Bold" icon={<TextB size="1.25em" />} onClick={() => wrap('**')} />
          <Button variant="ghost" size="sm" iconOnly aria-label="Code" icon={<Code size="1.25em" />} onClick={() => wrap('`')} />
          <Button variant="ghost" size="sm" iconOnly aria-label="Mention someone" icon={<At size="1.25em" />} onClick={insertAt} />
          <Button variant="ghost" size="sm" iconOnly aria-label="Attach a file" icon={<Paperclip size="1.25em" />} onClick={() => fileRef.current?.click()} />
          <input ref={fileRef} type="file" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) setFiles((fs) => [...fs, f.name]); e.target.value = ''; }} />
          <Button variant="primary" size="sm" iconOnly aria-label="Send message" icon={<PaperPlaneTilt size="1.25em" weight="fill" />} disabled={!text.trim() && files.length === 0} onClick={submit} />
        </div>
      </div>
      {hint && <p className="composer__hint">{hint}</p>}
      <ul id={listId} role="listbox" aria-label="People to mention" className="composer__mentions" hidden={!open}>
        {matches.map((p, i) => (
          <li key={p.id} id={`${listId}-${i}`} role="option" aria-selected={i === active} className="composer__option" onMouseDown={(e) => { e.preventDefault(); pick(p.name); }}>
            <Avatar name={p.name} size={24} /> <span>{p.name}</span> <span className="ds-muted">{p.role}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
