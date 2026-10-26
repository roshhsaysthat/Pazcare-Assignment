import { useState } from 'react';
import { CaretDown, ChatsCircle, Hash, List as ListIcon, Paperclip, Users, ArrowsOutSimple } from '@phosphor-icons/react';
import { Avatar, Button, Card, FilterTag, Input, List, ListRow, Nav, Sheet, tintVar, type NavItem } from '../../design-system';
import { PersonAvatar } from './avatars';
import { Composer } from './Composer';
import { MessageItem } from './MessageItem';
import { ThreadPanel } from './ThreadPanel';
import { personById, people, ME } from './data';
import { useMedia } from './useMedia';
import { useWorkspace } from './workspace';
import './canvas.css';

type Filter = 'all' | 'threads' | 'mentions' | 'files';
type Section = 'posts' | 'files' | 'people';

export default function CanvasConcept() {
  const ws = useWorkspace('automation');
  const mid = useMedia('(min-width: 900px)');
  const { channels, channel, channelId, messages, threadFor, selectChannel, send, reply, openRoot, openThread, root } = ws;
  const [section, setSection] = useState<Section>('posts');
  const [filter, setFilter] = useState<Filter>('all');
  const [menu, setMenu] = useState(false);
  const [subject, setSubject] = useState('');
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
        <div><h2>Northfield Design</h2><span className="ds-muted">8 channels</span></div>
      </div>
      {(['Hiring', 'Tools', 'Team'] as const).map((g) => {
        const open = !closedGroups.has(g);
        return (
          <section key={g} className="canvas__group">
            <button type="button" className="canvas__group-btn" aria-expanded={open} onClick={() => toggleGroup(g)}>
              <CaretDown size="1em" aria-hidden="true" style={{ transform: open ? 'none' : 'rotate(-90deg)', transition: 'transform var(--ds-dur-fast) var(--ds-ease)' }} />
              {g}
            </button>
            {open && (
              <List label={`${g} channels`}>
                {channels.filter((c) => c.group === g).map((c) => (
                  <ListRow
                    key={c.id}
                    current={c.id === channelId}
                    onClick={() => { selectChannel(c.id); setSection('posts'); setFilter('all'); setMenu(false); }}
                    leading={<span className="canvas__chip" style={{ background: tintVar(c.tint) }}><Hash size="1.1em" aria-hidden="true" /></span>}
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

  return (
    <div className="canvas">
      {mid && <aside className="canvas__side" aria-label="Teams and channels">{tree}</aside>}
      <main className="canvas__main">
        <div className="canvas__nav">
          {!mid && <Button variant="secondary" iconOnly aria-label="Open channels" icon={<ListIcon size="1.25em" />} onClick={() => setMenu(true)} />}
          <Nav label="Channel sections" variant="pill" items={sectionItems} current={section} onSelect={(id) => setSection(id as Section)} />
        </div>

        <header className="canvas__head">
          <h1><span className="ds-soft">{channel.name},</span><br />where the team talks it through.</h1>
          <p className="ds-muted">{channel.topic}</p>
        </header>

        {section === 'posts' && (
          <>
            <Card size="lg" className="canvas__start">
              <Input label="Post title (optional)" placeholder="Give your post a headline" value={subject} onChange={(e) => setSubject(e.target.value)} />
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
      </main>

      <Sheet open={!!openRoot} onClose={() => openThread(null)} title="Thread" side="right">
        {root && <ThreadPanel root={root} replies={threadFor(root.id)?.replies ?? []} onReply={(t, f) => reply(root.id, t, f)} />}
      </Sheet>
      {!mid && <Sheet open={menu} onClose={() => setMenu(false)} title="Channels" side="left">{tree}</Sheet>}
    </div>
  );
}
