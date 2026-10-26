import { useEffect, useMemo, useRef, useState } from 'react';
import { Hash, List as ListIcon, MagnifyingGlass, Moon, NotePencil, Phone, SpeakerHigh, Star, Sun, Users, VideoCamera, X } from '@phosphor-icons/react';
import { Avatar, Button, Input, List, ListRow, Nav, Sheet, type NavItem } from '../../design-system';
import { Composer } from './Composer';
import { MessageItem } from './MessageItem';
import { ThreadPanel } from './ThreadPanel';
import { dmChannels, dmMessages, people, personById, ME } from './data';
import { useMedia } from './useMedia';
import { useWorkspace } from './workspace';
import './rail.css';

const dmSeed = { channels: dmChannels, messages: dmMessages };

type Cmd = { id: string; label: string; group: string; hint?: string; run: () => void };

function PaletteBody({ items, onDone }: { items: Cmd[]; onDone: () => void }) {
  const [q, setQ] = useState('');
  const [i, setI] = useState(0);
  const res = items.filter((c) => c.label.toLowerCase().includes(q.toLowerCase()));
  const run = (c?: Cmd) => { if (!c) return; onDone(); c.run(); };
  return (
    <div className="palette">
      <Input
        label="Search channels and commands"
        hideLabel
        data-autofocus
        placeholder="Jump to a channel or run a command"
        value={q}
        role="combobox"
        aria-expanded
        aria-controls="palette-list"
        aria-activedescendant={res[i] ? `pal-${res[i].id}` : undefined}
        onChange={(e) => { setQ(e.target.value); setI(0); }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') { e.preventDefault(); setI((n) => Math.min(n + 1, res.length - 1)); }
          if (e.key === 'ArrowUp') { e.preventDefault(); setI((n) => Math.max(n - 1, 0)); }
          if (e.key === 'Enter') { e.preventDefault(); run(res[i]); }
        }}
      />
      <ul id="palette-list" role="listbox" aria-label="Results" className="palette__list">
        {res.length === 0 && <li className="palette__empty" role="presentation">Nothing matches. Try a channel name.</li>}
        {res.map((c, n) => (
          <li key={c.id} id={`pal-${c.id}`} role="option" aria-selected={n === i} className="palette__item" onMouseEnter={() => setI(n)} onClick={() => run(c)}>
            <span>{c.label}</span>
            <span className="palette__meta">{c.hint ? <kbd>{c.hint}</kbd> : c.group}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NewMessageBody({ onPick }: { onPick: (dmId: string) => void }) {
  const [q, setQ] = useState('');
  const matches = people.filter((p) => !p.bot && p.id !== ME && p.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="palette">
      <Input label="To" data-autofocus placeholder="Search for anyone on the team" value={q} onChange={(e) => setQ(e.target.value)} />
      <List label="People">
        {matches.length === 0 && <p className="palette__empty">No one matches that name.</p>}
        {matches.map((p) => (
          <ListRow key={p.id} leading={<Avatar name={p.name} size={32} status={p.status} />} title={p.name} description={p.role} onClick={() => onPick(`dm-${p.id}`)} />
        ))}
      </List>
    </div>
  );
}

export default function RailConcept() {
  const ws = useWorkspace('automation', dmSeed);
  const wide = useMedia('(min-width: 1200px)');
  const mid = useMedia('(min-width: 900px)');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [palette, setPalette] = useState(false);
  const [menu, setMenu] = useState(false);
  const [membersOpen, setMembersOpen] = useState(false);
  const [newMsg, setNewMsg] = useState(false);
  const [favs, setFavs] = useState<Set<string>>(new Set(['lead-hiring', 'automation']));
  const [call, setCall] = useState<null | 'audio' | 'video'>(null);
  const [cursor, setCursor] = useState(0);
  const composer = useRef<HTMLTextAreaElement>(null);
  const opened = useRef(false);
  const feed = useRef<HTMLDivElement>(null);

  const { channels, channel, channelId, messages, selectChannel, markRead, openRoot, openThread, root, threadFor, send, reply } = ws;

  useEffect(() => { setCursor(Math.max(messages.length - 1, 0)); }, [channelId, messages.length]);
  // Open a real thread on first load at desktop width, so channels, conversation, thread and composer are all visible at once.
  useEffect(() => { if (!opened.current && wide) { opened.current = true; openThread('a5'); } }, [wide, openThread]);
  useEffect(() => { feed.current?.querySelector(`[data-idx="${cursor}"]`)?.scrollIntoView({ block: 'nearest' }); }, [cursor, channelId]);

  const toggleFav = (id: string) => setFavs((f) => { const n = new Set(f); if (!n.delete(id)) n.add(id); return n; });
  const cmds: Cmd[] = useMemo(() => [
    ...channels.map((c) => ({ id: `ch-${c.id}`, label: c.dm ? `Message ${c.name}` : `Go to #${c.name}`, group: 'Channel', run: () => { selectChannel(c.id); setMenu(false); } })),
    { id: 'new', label: 'New message', group: 'Command', run: () => setNewMsg(true) },
    { id: 'fav', label: favs.has(channelId) ? 'Remove from favorites' : 'Add to favorites', group: 'Command', run: () => toggleFav(channelId) },
    { id: 'write', label: 'Write a message', group: 'Command', hint: '/', run: () => setTimeout(() => composer.current?.focus(), 0) },
    { id: 'thread', label: 'Open thread on selected message', group: 'Command', hint: 'T', run: () => messages[cursor] && openThread(messages[cursor].id) },
    { id: 'read', label: 'Mark channel as read', group: 'Command', hint: 'Shift R', run: () => markRead(channelId) },
    { id: 'members', label: 'Show members', group: 'Command', run: () => setMembersOpen(true) },
    { id: 'theme', label: theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme', group: 'Command', hint: 'Shift D', run: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')) },
  ], [channels, messages, cursor, channelId, theme, favs, selectChannel, markRead, openThread]);

  const order = [...channels.filter((c) => favs.has(c.id)), ...channels.filter((c) => !c.dm && !favs.has(c.id)), ...channels.filter((c) => c.dm && !favs.has(c.id))];
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing = !!t.closest('input, textarea, [contenteditable]');
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPalette((p) => !p); return; }
      if (e.altKey && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        e.preventDefault();
        const i = order.findIndex((c) => c.id === channelId);
        const n = order[(i + (e.key === 'ArrowDown' ? 1 : -1) + order.length) % order.length];
        selectChannel(n.id);
        return;
      }
      if (typing || document.querySelector('dialog[open]') || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === '/') { e.preventDefault(); composer.current?.focus(); }
      else if (e.key === 'j') setCursor((c) => Math.min(c + 1, messages.length - 1));
      else if (e.key === 'k') setCursor((c) => Math.max(c - 1, 0));
      else if (e.key === 't' && messages[cursor]) openThread(messages[cursor].id);
      else if (e.key === 'Escape') { openThread(null); setMembersOpen(false); }
      else if (e.shiftKey && e.key === 'R') markRead(channelId);
      else if (e.shiftKey && e.key === 'D') setTheme((x) => (x === 'dark' ? 'light' : 'dark'));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [order, channelId, messages, cursor, selectChannel, openThread, markRead]);

  const toItem = (c: (typeof channels)[number]): NavItem => ({
    id: c.id, label: c.name,
    icon: c.dm ? <Avatar name={personById(c.dm).name} size={20} status={personById(c.dm).status} /> : <Hash size="1.25em" aria-hidden="true" />,
    badge: c.unread || undefined,
    badgeLabel: `${c.unread} unread${c.mentions ? `, ${c.mentions} mentions` : ''}`,
  });
  const section = (heading: string, list: typeof channels) =>
    list.length > 0 && <Nav key={heading} label={heading} heading={heading} items={list.map(toItem)} current={channelId} onSelect={(id) => { selectChannel(id); setMenu(false); }} />;
  const channelNav = [
    section('Favorites', order.filter((c) => favs.has(c.id))),
    section('Channels', channels.filter((c) => !c.dm && !favs.has(c.id))),
    section('Direct messages', channels.filter((c) => c.dm && !favs.has(c.id))),
  ];

  const channelPane = (
    <div className="rail__channels-inner">
      <div className="rail__brand">
        <h2>Northfield <span className="ds-soft">Design</span></h2>
        <div className="rail__brand-row">
          <Button variant="secondary" size="sm" icon={<MagnifyingGlass size="1.25em" />} onClick={() => { setMenu(false); setPalette(true); }}>
            Jump to <kbd>Ctrl K</kbd>
          </Button>
          <Button variant="secondary" size="sm" iconOnly aria-label="New message" icon={<NotePencil size="1.25em" />} onClick={() => { setMenu(false); setNewMsg(true); }} />
        </div>
      </div>
      <div className="rail__scroll">{channelNav}</div>
      <div className="rail__me">
        <Avatar name={personById('jules').name} size={32} status="online" />
        <div><strong>Jules Mehta</strong><span className="ds-muted">Product designer</span></div>
        <Button variant="ghost" size="sm" iconOnly aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'} icon={theme === 'dark' ? <Sun size="1.25em" /> : <Moon size="1.25em" />} onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))} />
      </div>
    </div>
  );

  const members = (
    <List label="Members">
      {people.filter((p) => !p.bot).map((p) => (
        <ListRow key={p.id} leading={<Avatar name={p.name} size={32} status={p.status} />} title={p.name} description={p.role} />
      ))}
    </List>
  );

  const threadView = root ? (
    <ThreadPanel root={root} replies={threadFor(root.id)?.replies ?? []} onReply={(t, f) => reply(root.id, t, f)} />
  ) : null;

  const rightTitle = openRoot ? 'Thread' : 'Members';
  const rightBody = openRoot ? threadView : members;

  return (
    <div className="rail" data-ds-theme={theme} data-wide={wide} data-mid={mid}>
      {mid && <aside className="rail__channels" aria-label="Channels">{channelPane}</aside>}

      <main className="rail__main">
        <header className="rail__top">
          {!mid && <Button variant="ghost" iconOnly aria-label="Open channels" icon={<ListIcon size="1.25em" />} onClick={() => setMenu(true)} />}
          <div className="rail__title">
            <h1>{channel.dm ? channel.name : <><span className="ds-soft">#</span>{channel.name}</>}</h1>
            <p className="ds-muted">{channel.topic}</p>
          </div>
          <Button variant="ghost" iconOnly aria-label={favs.has(channelId) ? 'Remove from favorites' : 'Add to favorites'} aria-pressed={favs.has(channelId)} icon={<Star size="1.25em" weight={favs.has(channelId) ? 'fill' : 'regular'} />} onClick={() => toggleFav(channelId)} />
          {!channel.dm && <Button variant="ghost" iconOnly aria-label="Show members" aria-pressed={membersOpen && !openRoot} icon={<Users size="1.25em" />} onClick={() => { openThread(null); setMembersOpen((m) => !m); }} />}
        </header>

        {channel.live && !channel.dm && (
          <div className="rail__huddle">
            <SpeakerHigh size="1.25em" aria-hidden="true" />
            <span><strong>{channel.live.title}</strong> <span className="ds-muted">{channel.live.listeners} listening</span></span>
            <span className="rail__stack">{channel.live.speakers.map((s) => <Avatar key={s} name={personById(s).name} size={24} />)}</span>
            {call ? (
              <span className="rail__meet"><span>In {call} call</span><Button size="sm" variant="secondary" onClick={() => setCall(null)}>Leave meet</Button></span>
            ) : (
              <span className="rail__meet" role="group" aria-label="Join meet">
                <span className="ds-muted">Join meet</span>
                <Button size="sm" variant="secondary" icon={<Phone size="1.25em" />} onClick={() => setCall('audio')}>Audio call</Button>
                <Button size="sm" variant="primary" icon={<VideoCamera size="1.25em" />} onClick={() => setCall('video')}>Video call</Button>
              </span>
            )}
          </div>
        )}

        <div className="rail__feed" ref={feed} role="log" aria-live="polite" aria-label={`Messages in ${channel.name}`}>
          <p className="ds-sr-only">Press j and k to move between messages and t to open a thread.</p>
          {messages.map((m, idx) => {
            const th = threadFor(m.id);
            const grouped = idx > 0 && messages[idx - 1].author === m.author && !m.candidate && !messages[idx - 1].candidate;
            return (
              <div key={m.id} data-idx={idx} data-cursor={idx === cursor || undefined} className="rail__row" onClick={() => setCursor(idx)}>
                <MessageItem msg={m} grouped={grouped} replyCount={th?.replies.length} lastReply={th?.replies.at(-1)?.time} onOpenThread={() => openThread(m.id)} threadActive={openRoot === m.id} />
              </div>
            );
          })}
        </div>

        <div className="rail__compose">
          <Composer label={channel.dm ? `Message ${channel.name}` : `Message #${channel.name}`} placeholder={channel.dm ? `Message ${channel.name}` : `Message #${channel.name}`} inputRef={composer} onSend={(t, f) => send(t, f)} />
          <p className="rail__keys" aria-label="Keyboard shortcuts">
            <span><kbd>/</kbd> write</span><span><kbd>J</kbd><kbd>K</kbd> move</span><span><kbd>T</kbd> thread</span><span><kbd>Ctrl K</kbd> jump</span><span><kbd>Alt</kbd><kbd>↑</kbd><kbd>↓</kbd> channels</span>
          </p>
        </div>
      </main>

      {wide && (
        <aside className="rail__right" aria-label={rightTitle}>
          <div className="rail__right-head">
            <h2>{rightTitle}</h2>
            {openRoot && <Button variant="ghost" size="sm" iconOnly aria-label="Close thread" icon={<X size="1.25em" />} onClick={() => openThread(null)} />}
          </div>
          <div className="rail__right-body">{rightBody}</div>
        </aside>
      )}
      {!wide && (
        <Sheet open={!!openRoot || membersOpen} onClose={() => { openThread(null); setMembersOpen(false); }} title={rightTitle} side="right">
          {rightBody}
        </Sheet>
      )}
      {!mid && (
        <Sheet open={menu} onClose={() => setMenu(false)} title="Channels" side="left">{channelPane}</Sheet>
      )}
      <Sheet open={palette} onClose={() => setPalette(false)} title="Command menu">
        <PaletteBody items={cmds} onDone={() => setPalette(false)} />
      </Sheet>
      <Sheet open={newMsg} onClose={() => setNewMsg(false)} title="New message">
        <NewMessageBody onPick={(id) => { setNewMsg(false); selectChannel(id); setTimeout(() => composer.current?.focus(), 0); }} />
      </Sheet>
      <p className="ds-sr-only" aria-live="polite">{call ? `You joined the ${call} call` : ''}</p>
    </div>
  );
}
