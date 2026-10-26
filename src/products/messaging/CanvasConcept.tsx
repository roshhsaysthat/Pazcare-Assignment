import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowBendUpLeft, CaretDown, ChatsCircle, Hash, List as ListIcon, MagnifyingGlass, Paperclip, Users, ArrowsOutSimple, X } from '@phosphor-icons/react';
import { Avatar, Button, Card, FilterTag, Input, List, ListRow, Nav, Sheet, tintVar, type NavItem } from '../../design-system';
import { PersonAvatar, bubbleTint } from './avatars';
import { Composer } from './Composer';
import { MessageItem } from './MessageItem';
import { ThreadPanel } from './ThreadPanel';
import { dmChannels, dmMessages, personById, people, ME } from './data';
import { useMedia } from './useMedia';
import { useWorkspace } from './workspace';
import './canvas.css';

type Filter = 'all' | 'threads' | 'mentions' | 'files';
type Section = 'posts' | 'files' | 'people';

const dmSeed = { channels: dmChannels, messages: dmMessages };
const groups = ['Hiring', 'Team', 'Direct messages'] as const;
const inGroup = (c: { dm?: string; group: string }, g: string) => (g === 'Direct messages' ? !!c.dm : !c.dm && c.group === g);

export default function CanvasConcept() {
  const ws = useWorkspace('lead-hiring', dmSeed);
  const mid = useMedia('(min-width: 900px)');
  const { allMessages, threads, channels, channel, channelId, messages, threadFor, selectChannel, send, reply, openRoot, openThread, root } = ws;
  const [section, setSection] = useState<Section>('posts');
  const [filter, setFilter] = useState<Filter>('all');
  const [menu, setMenu] = useState(false);
  const [subject, setSubject] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => { if (searchOpen) searchRef.current?.focus(); }, [searchOpen]);
  const closeSearch = () => { setSearchOpen(false); setQuery(''); };
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [closedGroups, setClosedGroups] = useState<Set<string>>(new Set());

  const me = personById(ME);
  const shown = messages.filter((m) => {
    if (filter === 'threads') return (threadFor(m.id)?.replies.length ?? 0) > 0;
    if (filter === 'mentions') return m.body.includes(`@${me.name}`);
    if (filter === 'files') return !!m.files?.length;
    return true;
  });
  const files = messages.flatMap((m) => [...(m.files ?? []), ...(threadFor(m.id)?.replies.flatMap((r) => r.files ?? []) ?? [])].map((f) => ({ f, by: m.author, time: m.time })));

  const toggle = (id: string) => setCollapsed((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleGroup = (g: string) => setClosedGroups((s) => { const n = new Set(s); n.has(g) ? n.delete(g) : n.add(g); return n; });

  const tree = (
    <div className="canvas__tree">
      <div className="canvas__team">
        <Avatar name="Northfield Design" size={40} shape="square" tint="sky" />
        <div><h2>Northfield Design</h2><span className="ds-muted">{channels.filter((c) => !c.dm && c.group !== 'Tools').length} channels</span></div>
      </div>
      {groups.map((g) => {
        const open = !closedGroups.has(g);
        return (
          <section key={g} className="canvas__group">
            <button type="button" className="canvas__group-btn" aria-expanded={open} onClick={() => toggleGroup(g)}>
              <CaretDown size="1em" aria-hidden="true" style={{ transform: open ? 'none' : 'rotate(-90deg)', transition: 'transform var(--ds-dur-fast) var(--ds-ease)' }} />
              {g}
            </button>
            {open && (
              <List label={g === 'Direct messages' ? g : `${g} channels`}>
                {channels.filter((c) => inGroup(c, g)).map((c) => (
                  <ListRow
                    key={c.id}
                    current={c.id === channelId}
                    onClick={() => { selectChannel(c.id); setSection('posts'); setFilter('all'); setReplyTo(null); setMenu(false); }}
                    leading={c.dm ? <PersonAvatar name={personById(c.dm).name} size={28} status={personById(c.dm).status} /> : <span className="canvas__chip" style={{ background: tintVar(c.tint) }}><Hash size="1.1em" aria-hidden="true" /></span>}
                    title={c.name}
                    trailing={c.unread ? <span className="ds-nav__badge" aria-label={`${c.unread} unread`}>{c.unread}</span> : undefined}
                  />
                ))}
              </List>
            )}
          </section>
        );
      })}
    </div>
  );

  const sectionItems: NavItem[] = [
    { id: 'posts', label: 'Posts', icon: <ChatsCircle size="1.25em" aria-hidden="true" /> },
    { id: 'files', label: 'Files', icon: <Paperclip size="1.25em" aria-hidden="true" /> },
    { id: 'people', label: 'People', icon: <Users size="1.25em" aria-hidden="true" /> },
  ];

  const post = (m: (typeof messages)[number]) => {
    const th = threadFor(m.id);
    const count = th?.replies.length ?? 0;
    const open = count > 0 && !collapsed.has(m.id);
    return (
      <Card key={m.id} as="article" size="lg" className="canvas__post">
        <MessageItem msg={m} avatarSize={40} />
        <div className="canvas__post-actions">
          {count > 0 && (
            <Button variant="ghost" size="sm" aria-expanded={open} onClick={() => toggle(m.id)}>
              {open ? 'Hide' : 'Show'} {count} {count === 1 ? 'reply' : 'replies'}
            </Button>
          )}
          <Button variant="ghost" size="sm" icon={<ArrowsOutSimple size="1.25em" />} onClick={() => openThread(m.id)}>Focus thread</Button>
        </div>
        {open && (
          <div className="canvas__replies" role="group" aria-label={`Replies to ${personById(m.author).name}`}>
            {th!.replies.map((r) => <MessageItem key={r.id} msg={r} avatarSize={28} />)}
          </div>
        )}
        <div className="canvas__quick">
          <Composer label={`Reply to ${personById(m.author).name}'s post`} placeholder="Reply to this post" variant="pill" onSend={(t, f) => { reply(m.id, t, f); setCollapsed((s) => { const n = new Set(s); n.delete(m.id); return n; }); }} />
        </div>
      </Card>
    );
  };

  // Direct messages read as a chat: flat messages, "Reply" opens a small thread under that message.
  const chatMessage = (m: (typeof messages)[number]) => {
    const th = threadFor(m.id);
    const count = th?.replies.length ?? 0;
    const open = count > 0 && !collapsed.has(m.id);
    const replying = replyTo === m.id;
    return (
      <article key={m.id} className="canvas__msg">
        <MessageItem msg={m} avatarSize={40} tint={bubbleTint(m.author)} />
        <div className="canvas__post-actions">
          {count > 0 && (
            <Button variant="ghost" size="sm" aria-expanded={open} onClick={() => toggle(m.id)}>
              {open ? 'Hide' : 'Show'} {count} {count === 1 ? 'reply' : 'replies'}
            </Button>
          )}
          <Button variant="ghost" size="sm" icon={<ArrowBendUpLeft size="1.25em" />} aria-expanded={replying} onClick={() => setReplyTo(replying ? null : m.id)}>Reply</Button>
        </div>
        {open && (
          <div className="canvas__replies" role="group" aria-label={`Replies to ${personById(m.author).name}`}>
            {th!.replies.map((r) => <MessageItem key={r.id} msg={r} avatarSize={28} tint={bubbleTint(r.author)} />)}
          </div>
        )}
        {replying && (
          <div className="canvas__quick">
            <Composer label={`Reply to ${personById(m.author).name}'s message`} placeholder="Reply to this message" variant="pill" autoFocus onSend={(t, f) => { reply(m.id, t, f); setReplyTo(null); setCollapsed((s) => { const n = new Set(s); n.delete(m.id); return n; }); }} />
          </div>
        )}
      </article>
    );
  };
  const dmPerson = channel.dm ? personById(channel.dm) : null;

  // Search: messages (with thread replies), files, people and channels. The Tools channels are not part of this layout, so they are skipped.
  const needle = query.trim().toLowerCase();
  const searching = searchOpen && needle.length > 0;
  const strip = (s: string) => s.replace(/\*\*/g, '').replace(/`/g, '');
  const mark = (text: string): ReactNode => {
    const i = text.toLowerCase().indexOf(needle);
    return i < 0 ? text : <>{text.slice(0, i)}<mark>{text.slice(i, i + needle.length)}</mark>{text.slice(i + needle.length)}</>;
  };
  const snippet = (text: string) => { const i = Math.max(0, strip(text).toLowerCase().indexOf(needle) - 40); return (i > 0 ? '…' : '') + strip(text).slice(i, i + 120); };
  const where = (c: (typeof channels)[number], authorId?: string) => (c.dm ? (c.dm === ME ? 'Notes to self' : authorId === ME || !authorId ? `DM with ${c.name}` : 'a DM') : `#${c.name}`);
  const searchable = channels.filter((c) => c.dm || c.group !== 'Tools');
  const found = !searching ? null : {
    channels: searchable.filter((c) => !c.dm && `${c.name} ${c.topic}`.toLowerCase().includes(needle)).slice(0, 6),
    people: people.filter((p) => !p.bot && p.id !== ME && `${p.name} ${p.role}`.toLowerCase().includes(needle)).slice(0, 6),
    messages: searchable.flatMap((c) => [...(allMessages[c.id] ?? []), ...threads.filter((t) => t.channelId === c.id).flatMap((t) => t.replies)]
      .filter((m) => `${strip(m.body)} ${personById(m.author).name}`.toLowerCase().includes(needle)).map((m) => ({ m, c }))).slice(0, 8),
    files: searchable.flatMap((c) => (allMessages[c.id] ?? []).flatMap((m) => (m.files ?? []).filter((f) => f.toLowerCase().includes(needle)).map((f) => ({ f, m, c })))).slice(0, 6),
  };
  const openConversation = (id: string) => { selectChannel(id); setSection('posts'); setFilter('all'); setReplyTo(null); closeSearch(); };
  const nothing = found && !found.channels.length && !found.people.length && !found.messages.length && !found.files.length;

  return (
    <div className="canvas">
      {mid && <aside className="canvas__side" aria-label="Teams and channels">{tree}</aside>}
      <main className={`canvas__main${dmPerson && section === 'posts' ? ' canvas__main--chat' : ''}`}>
        <div className={`canvas__nav${searchOpen ? ' canvas__nav--search' : ''}`}>
          {!mid && <Button variant="secondary" iconOnly aria-label="Open channels" icon={<ListIcon size="1.25em" />} onClick={() => setMenu(true)} />}
          <Nav label="Channel sections" variant="pill" items={sectionItems} current={section} onSelect={(id) => { setSection(id as Section); closeSearch(); }} />
          {searchOpen ? (
            <div className="ds-nav ds-nav--pill canvas__search" role="search">
              <MagnifyingGlass size="1.25em" aria-hidden="true" className="canvas__search-icon" />
              <Input
                ref={searchRef} label="Search messages, files, people and channels" hideLabel placeholder="Search messages, files, people"
                value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Escape') closeSearch(); }}
              />
              <button type="button" className="ds-nav__item canvas__pill-btn" aria-label="Close search" onClick={closeSearch}><X size="1.25em" aria-hidden="true" /></button>
            </div>
          ) : (
            <div className="ds-nav ds-nav--pill">
              <button type="button" className="ds-nav__item canvas__pill-btn" aria-label="Search" aria-expanded={false} onClick={() => setSearchOpen(true)}>
                <MagnifyingGlass size="1.25em" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>

        {searching && found && (
          <section className="canvas__results" aria-label="Search results" aria-live="polite">
            {nothing && <Card size="lg"><p className="ds-muted">Nothing matches “{query.trim()}”. Try a name, a word from a message, or a file name.</p></Card>}
            {found.channels.length > 0 && (
              <Card size="lg" className="canvas__panel"><h2>Channels</h2>
                <List label="Channels found">{found.channels.map((c) => <ListRow key={c.id} onClick={() => openConversation(c.id)} leading={<span className="canvas__chip" style={{ background: tintVar(c.tint) }}><Hash size="1.1em" aria-hidden="true" /></span>} title={mark(c.name)} description={c.topic} />)}</List>
              </Card>
            )}
            {found.people.length > 0 && (
              <Card size="lg" className="canvas__panel"><h2>People</h2>
                <List label="People found">{found.people.map((p) => <ListRow key={p.id} onClick={() => openConversation(`dm-${p.id}`)} leading={<PersonAvatar name={p.name} size={36} status={p.status} />} title={mark(p.name)} description={p.role} />)}</List>
              </Card>
            )}
            {found.messages.length > 0 && (
              <Card size="lg" className="canvas__panel"><h2>Messages</h2>
                <List label="Messages found">{found.messages.map(({ m, c }) => <ListRow key={m.id} onClick={() => openConversation(c.id)} leading={<PersonAvatar name={personById(m.author).name} size={36} />} title={`${personById(m.author).name} in ${where(c, m.author)}`} description={mark(snippet(m.body))} meta={m.time} />)}</List>
              </Card>
            )}
            {found.files.length > 0 && (
              <Card size="lg" className="canvas__panel"><h2>Files</h2>
                <List label="Files found">{found.files.map(({ f, m, c }) => <ListRow key={f + m.id} onClick={() => openConversation(c.id)} leading={<Paperclip size="1.25em" aria-hidden="true" />} title={mark(f)} description={`Shared by ${personById(m.author).name} in ${where(c)}`} meta={m.time} />)}</List>
              </Card>
            )}
          </section>
        )}

        {!searching && (
          <>
        {dmPerson ? (
          <header className="canvas__head canvas__head--dm">
            <PersonAvatar name={dmPerson.name} size={56} status={dmPerson.status} />
            <div>
              <h1>{dmPerson.name}</h1>
              <p className="ds-muted">{dmPerson.role}</p>
            </div>
          </header>
        ) : (
          <header className="canvas__head">
            <h1><span className="ds-soft">{channel.name},</span><br />where the team talks it through.</h1>
            <p className="ds-muted">{channel.topic}</p>
          </header>
        )}

        {section === 'posts' && dmPerson && (
          <>
            <div role="group" aria-label="Filter messages" className="canvas__filters">
              {([['all', 'All posts'], ['threads', 'With replies'], ['mentions', 'Mentions me'], ['files', 'With files']] as [Filter, string][]).map(([k, l]) => (
                <FilterTag key={k} pressed={filter === k} onClick={() => setFilter(k)}>{l}</FilterTag>
              ))}
            </div>
            <div className="canvas__chat" role="feed" aria-label={`Messages with ${dmPerson.name}`}>
              {shown.length === 0 ? <p className="ds-muted canvas__empty">No messages match this filter yet.</p> : shown.map(chatMessage)}
            </div>
            <div className="canvas__dock dm-compose" style={{ ['--bubble' as string]: tintVar(bubbleTint(ME)) }}>
              <Composer label={`Message ${dmPerson.name}`} placeholder={`Message ${dmPerson.name}`} variant="pill" onSend={(t, f) => send(t, f)} />
            </div>
          </>
        )}

        {section === 'posts' && !dmPerson && (
          <>
            <Card size="lg" className="canvas__start">
              <Input label="Topic or agenda (optional)" placeholder="Name the topic, or list the agenda" value={subject} onChange={(e) => setSubject(e.target.value)} />
              <Composer
                label={`Start a post in ${channel.name}`}
                placeholder="Start a post. Share a proposal, a question or a decision."
                variant="card"
                onSend={(t, f) => { send(subject.trim() ? `**${subject.trim()}**\n${t}` : t, f); setSubject(''); }}
                hint="Enter sends. Shift Enter adds a line."
              />
            </Card>

            <div role="group" aria-label="Filter posts" className="canvas__filters">
              {([['all', 'All posts'], ['threads', 'With replies'], ['mentions', 'Mentions me'], ['files', 'With files']] as [Filter, string][]).map(([k, l]) => (
                <FilterTag key={k} pressed={filter === k} onClick={() => setFilter(k)}>{l}</FilterTag>
              ))}
            </div>

            <div className="canvas__posts" role="feed" aria-label={`Posts in ${channel.name}`}>
              {shown.length === 0 ? <p className="ds-muted canvas__empty">No posts match this filter yet.</p> : shown.map(post)}
            </div>
          </>
        )}

        {section === 'files' && (
          <Card size="lg" className="canvas__panel">
            <h2>Files in {channel.name}</h2>
            {files.length === 0 ? <p className="ds-muted">No files shared here yet. Attach one when you post.</p> : (
              <List label="Files">
                {files.map(({ f, by, time }) => <ListRow key={f + time} leading={<Paperclip size="1.25em" aria-hidden="true" />} title={f} description={`Shared by ${personById(by).name}`} meta={time} />)}
              </List>
            )}
          </Card>
        )}

        {section === 'people' && (
          <Card size="lg" className="canvas__panel">
            <h2>People</h2>
            <List label="People">
              {people.filter((p) => !p.bot).map((p) => <ListRow key={p.id} leading={<PersonAvatar name={p.name} size={36} status={p.status} />} title={p.name} description={p.role} />)}
            </List>
          </Card>
        )}
          </>
        )}
      </main>

      <Sheet open={!!openRoot} onClose={() => openThread(null)} title="Thread" side="right">
        {root && <ThreadPanel root={root} replies={threadFor(root.id)?.replies ?? []} onReply={(t, f) => reply(root.id, t, f)} />}
      </Sheet>
      {!mid && <Sheet open={menu} onClose={() => setMenu(false)} title="Channels" side="left">{tree}</Sheet>}
    </div>
  );
}
