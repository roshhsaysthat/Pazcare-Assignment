import { useMemo, useState } from 'react';
import { ArrowBendUpLeft, ArrowLeft, Check, HandWaving, Hash, Microphone, MicrophoneSlash } from '@phosphor-icons/react';
import { Avatar, Banner, Button, Card, FilterTag, List, ListRow, Sheet, Tag, tintVar } from '../../../design-system';
import { PersonAvatar } from './avatars';
import { Composer } from './Composer';
import { CopyLink, channelLink, inviteLink } from './CopyLink';
import { MessageItem } from './MessageItem';
import { ThreadPanel } from './ThreadPanel';
import { personById, ME, type Channel, type Message } from './data';
import { useWorkspace } from './workspace';
import './rooms.css';

type Item = { key: string; channel: Channel; msg: Message; kind: 'mention' | 'unread' };
type Notice = { text: string; undo?: () => void };

// People who opened the invite link to the portfolio review room and are waiting to be let in.
const guests = [{ id: 'noor', name: 'Noor Hadid' }, { id: 'sam', name: 'Sam Ortega' }];

export default function RoomsConcept() {
  const ws = useWorkspace('automation');
  const { channels, channel, channelId, messages, allMessages, threadFor, selectChannel, send, reply, openRoot, openThread, root } = ws;
  const me = personById(ME);
  const [view, setView] = useState<'inbox' | 'room'>('inbox');
  const [filter, setFilter] = useState<'needs' | 'all'>('needs');
  const [done, setDone] = useState<Set<string>>(new Set());
  const [replying, setReplying] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [joined, setJoined] = useState<Set<string>>(new Set());
  const [started, setStarted] = useState<Set<string>>(new Set());
  const [muted, setMuted] = useState(true);
  const [hand, setHand] = useState(false);
  const [waiting, setWaiting] = useState(guests);
  const [admitted, setAdmitted] = useState<typeof guests>([]);
  const [lastCall, setLastCall] = useState('');
  const decide = (g: (typeof guests)[number], accept: boolean) => {
    setWaiting((w) => w.filter((x) => x.id !== g.id));
    if (accept) setAdmitted((a) => [...a, g]);
    setLastCall(`${g.name} was ${accept ? 'accepted into' : 'declined from'} the room.`);
  };
  const gated = channelId === 'portfolio-reviews';

  /** The unified inbox: mentions first, then the latest message of every channel that still has unread. */
  const items: Item[] = useMemo(() => {
    const out: Item[] = [];
    for (const c of channels) {
      for (const m of allMessages[c.id] ?? []) if (m.body.includes(`@${me.name}`) && !done.has(m.id)) out.push({ key: m.id, channel: c, msg: m, kind: 'mention' });
    }
    for (const c of channels) {
      const list = allMessages[c.id] ?? [];
      const last = list[list.length - 1];
      if (c.unread && last && !out.some((i) => i.channel.id === c.id) && !done.has(last.id)) out.push({ key: `u-${last.id}`, channel: c, msg: last, kind: 'unread' });
    }
    return out;
  }, [channels, allMessages, done, me.name]);

  const needs = items.filter((i) => i.kind === 'mention');
  const visible = filter === 'needs' ? needs : items;
  const liveRooms = channels.filter((c) => c.live || started.has(c.id));

  const openRoom = (c: Channel, rootId?: string) => {
    selectChannel(c.id);
    if (rootId && (threadFor(rootId)?.replies.length ?? 0) > 0) openThread(rootId);
    setView('room');
  };

  const markDone = (it: Item) => {
    setDone((d) => new Set(d).add(it.msg.id));
    setNotice({ text: `Marked done in #${it.channel.name}.`, undo: () => { setDone((d) => { const n = new Set(d); n.delete(it.msg.id); return n; }); setNotice(null); } });
  };

  const live = channel.live ?? (started.has(channelId) ? { title: 'Pull-up chat', speakers: [ME], listeners: 1 } : undefined);
  const isJoined = joined.has(channelId);
  const toggleJoin = () => setJoined((s) => { const n = new Set(s); n.has(channelId) ? n.delete(channelId) : n.add(channelId); return n; });

  return (
    <div className="rooms" data-view={view}>
      <section className="rooms__inbox" aria-labelledby="inbox-title">
        <header className="rooms__intro">
          <h1 id="inbox-title">
            <span className="ds-soft">{needs.length === 0 ? 'Nothing needs you.' : `${needs.length} ${needs.length === 1 ? 'thing needs' : 'things need'} you,`}</span><br />
            {needs.length === 0 ? 'Enjoy the quiet.' : 'everything else can wait.'}
          </h1>
        </header>

        {liveRooms.length > 0 && (
          <section aria-label="Live now" className="rooms__live">
            <h2 className="rooms__label"><span className="rooms__pulse" aria-hidden="true" /> Live now</h2>
            <ul className="rooms__live-list">
              {liveRooms.map((c) => {
                const l = c.live ?? { title: 'Pull-up chat', speakers: [ME], listeners: 1 };
                return (
                  <li key={c.id}>
                    <Card variant="tint" tint={c.tint} size="lg" className="rooms__live-card">
                      <span className="rooms__live-meta">#{c.name}</span>
                      <strong className="rooms__live-title">{l.title}</strong>
                      <span className="rooms__stack">{l.speakers.map((s) => <PersonAvatar key={s} name={personById(s).name} size={32} />)}<span>{l.listeners} listening</span></span>
                      <Button variant="primary" size="sm" onClick={() => { openRoom(c); }}>Open room</Button>
                    </Card>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <section aria-label="Inbox" className="rooms__feed">
          <div className="rooms__feed-head">
            <h2 className="rooms__label">Inbox</h2>
            <div role="group" aria-label="Inbox filter" className="rooms__chips">
              <FilterTag pressed={filter === 'needs'} onClick={() => setFilter('needs')}>Needs you · {needs.length}</FilterTag>
              <FilterTag pressed={filter === 'all'} onClick={() => setFilter('all')}>Everything · {items.length}</FilterTag>
            </div>
          </div>

          {notice && (
            <Banner onDismiss={() => setNotice(null)}>
              {notice.text} {notice.undo && <button type="button" className="rooms__undo" onClick={notice.undo}>Undo</button>}
            </Banner>
          )}

          {visible.length === 0 ? (
            <Card variant="flat" size="lg" className="rooms__empty"><Check size="1.5em" aria-hidden="true" /><p>You are all caught up. Open a room to start a conversation.</p></Card>
          ) : (
            <ul className="rooms__items">
              {visible.map((it) => {
                const p = personById(it.msg.author);
                const open = replying === it.key;
                return (
                  <li key={it.key} className="rooms__item">
                    <button type="button" className="rooms__open" onClick={() => openRoom(it.channel, it.msg.id)}>
                      <span className="rooms__chip" style={{ background: tintVar(it.channel.tint) }}><Hash size="1.1em" aria-hidden="true" /></span>
                      <span className="rooms__item-body">
                        <span className="rooms__item-top">
                          <strong>{it.channel.name}</strong>
                          {it.kind === 'mention' ? <Tag tone="signal" dot>Mentions you</Tag> : <Tag>{it.channel.unread} unread</Tag>}
                          <time className="ds-muted">{it.msg.time}</time>
                        </span>
                        <span className="rooms__preview"><PersonAvatar name={p.name} size={20} shape={p.bot ? 'square' : 'circle'} /> <span><strong>{p.name.split(' ')[0]}:</strong> {it.msg.body.replace(/\*\*/g, '').replace(/`/g, '')}</span></span>
                      </span>
                    </button>
                    <div className="rooms__item-actions">
                      <Button variant="ghost" size="sm" icon={<ArrowBendUpLeft size="1.25em" />} aria-expanded={open} onClick={() => setReplying(open ? null : it.key)}>Reply here</Button>
                      <Button variant="ghost" size="sm" icon={<Check size="1.25em" />} onClick={() => markDone(it)}>Done</Button>
                    </div>
                    {open && (
                      <div className="rooms__inline">
                        <Composer
                          label={`Reply to ${p.name} in ${it.channel.name}`}
                          placeholder={`Reply to ${p.name.split(' ')[0]} without leaving your inbox`}
                          variant="pill"
                          autoFocus
                          onSend={(t, f) => { reply(it.msg.id, t, f, it.channel.id); setReplying(null); setNotice({ text: `Reply sent to #${it.channel.name}.` }); }}
                        />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section aria-label="All rooms" className="rooms__all">
          <h2 className="rooms__label">All rooms</h2>
          <List label="All rooms">
            {channels.map((c) => (
              <ListRow
                key={c.id}
                current={view === 'room' && c.id === channelId}
                onClick={() => openRoom(c)}
                leading={<span className="rooms__chip" style={{ background: tintVar(c.tint) }}><Hash size="1.1em" aria-hidden="true" /></span>}
                title={c.name}
                description={c.topic}
                trailing={c.unread ? <span className="ds-nav__badge" aria-label={`${c.unread} unread`}>{c.unread}</span> : undefined}
              />
            ))}
          </List>
        </section>
      </section>

      <section className="rooms__room" aria-label={`Room ${channel.name}`}>
        <header className="rooms__room-head">
          <Button className="rooms__back" variant="ghost" iconOnly aria-label="Back to inbox" icon={<ArrowLeft size="1.25em" />} onClick={() => setView('inbox')} />
          <div>
            <h2><span className="ds-soft">#</span>{channel.name}</h2>
            <p className="ds-muted">{channel.topic}</p>
          </div>
          <span className="rooms__room-share"><CopyLink label={`Copy link to #${channel.name}`} url={channelLink(channel.name)} /></span>
        </header>

        <Card variant="tint" tint={channel.tint} size="xl" className="rooms__stage">
          {live ? (
            <>
              <div className="rooms__stage-top">
                <Tag tone="danger" dot>Live</Tag>
                <strong>{live.title}</strong>
                <span className="rooms__listening">{live.listeners + (isJoined ? 1 : 0) + (gated ? admitted.length : 0)} listening</span>
                <CopyLink variant="secondary" size="sm" label="Copy invite link" text="Copy invite link" url={inviteLink(live.title === 'Pull-up chat' ? `${channel.name} pull-up chat` : live.title)} />
              </div>
              <ul className="rooms__speakers" aria-label="Speakers">
                {live.speakers.map((s, i) => (
                  <li key={s} data-speaking={i === 0 && isJoined && muted ? 'true' : undefined}>
                    <span className="rooms__ring"><PersonAvatar name={personById(s).name} size={64} /></span>
                    <span>{personById(s).name.split(' ')[0]}</span>
                  </li>
                ))}
                {gated && admitted.map((g) => <li key={g.id}><span className="rooms__ring"><Avatar name={g.name} size={64} /></span><span>{g.name.split(' ')[0]}</span></li>)}
                {isJoined && <li><span className="rooms__ring"><PersonAvatar name={me.name} size={64} /></span><span>You</span></li>}
              </ul>
              {gated && waiting.length > 0 && (
                <ul className="rooms__waiting" aria-label="Waiting to join">
                  {waiting.map((g) => (
                    <li key={g.id}>
                      <Avatar name={g.name} size={32} />
                      <span className="rooms__waiting-who"><strong>{g.name}</strong><span>Opened the invite link</span></span>
                      <Button size="sm" variant="primary" aria-label={`Accept ${g.name}`} onClick={() => decide(g, true)}>Accept</Button>
                      <Button size="sm" variant="secondary" aria-label={`Decline ${g.name}`} onClick={() => decide(g, false)}>Decline</Button>
                    </li>
                  ))}
                </ul>
              )}
              {gated && <p className="rooms__waiting-note" role="status">{lastCall}</p>}
              <div className="rooms__controls">
                {isJoined ? (
                  <>
                    <Button variant="secondary" icon={muted ? <MicrophoneSlash size="1.25em" /> : <Microphone size="1.25em" />} aria-pressed={!muted} onClick={() => setMuted((m) => !m)}>{muted ? 'Unmute' : 'Mute'}</Button>
                    <Button variant="secondary" icon={<HandWaving size="1.25em" />} aria-pressed={hand} onClick={() => setHand((h) => !h)}>{hand ? 'Lower hand' : 'Raise hand'}</Button>
                    <Button variant="danger" onClick={toggleJoin}>Leave</Button>
                  </>
                ) : (
                  <Button variant="primary" onClick={toggleJoin}>Join as listener</Button>
                )}
              </div>
              <p className="ds-sr-only" role="status">{isJoined ? (muted ? 'Microphone muted' : 'Microphone on') : ''}{hand ? ', hand raised' : ''}</p>
            </>
          ) : (
            <div className="rooms__quiet">
              <strong>Quiet right now.</strong>
              <span>Need a voice for this? Pull up a chair.</span>
              <Button variant="primary" onClick={() => { setStarted((s) => new Set(s).add(channelId)); setJoined((s) => new Set(s).add(channelId)); }}>Pull up a chair</Button>
            </div>
          )}
        </Card>

        <div className="rooms__chat" role="log" aria-live="polite" aria-label={`Messages in ${channel.name}`}>
          {messages.map((m) => {
            const th = threadFor(m.id);
            return <MessageItem key={m.id} msg={m} replyCount={th?.replies.length} lastReply={th?.replies.at(-1)?.time} onOpenThread={() => openThread(m.id)} threadActive={openRoot === m.id} />;
          })}
        </div>
        <div className="rooms__compose">
          <Composer label={`Message #${channel.name}`} placeholder="Say something to the room" variant="pill" onSend={(t, f) => send(t, f)} />
        </div>
      </section>

      <Sheet open={!!openRoot} onClose={() => openThread(null)} title="Thread" side="right">
        {root && <ThreadPanel root={root} replies={threadFor(root.id)?.replies ?? []} onReply={(t, f) => reply(root.id, t, f)} />}
      </Sheet>
    </div>
  );
}
