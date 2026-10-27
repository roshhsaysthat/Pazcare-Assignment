import { ChatCircleText, Paperclip } from '@phosphor-icons/react';
import { Card, Meter, Tag, tintVar, type Tint } from '../../../design-system';
import { PersonAvatar } from './avatars';
import { personById, type Message } from './data';
import { rich } from './rich';

type Props = {
  msg: Message;
  replyCount?: number;
  lastReply?: string;
  onOpenThread?: () => void;
  avatarSize?: number;
  grouped?: boolean; // hide avatar for consecutive messages
  threadActive?: boolean;
  tint?: Tint; // direct messages: draw the message as a text box in this accent
};

/** One message. Bot messages get a square avatar and an optional candidate card. */
export function MessageItem({ msg, replyCount = 0, lastReply, onOpenThread, avatarSize = 36, grouped, threadActive, tint }: Props) {
  const p = personById(msg.author);
  return (
    <article className={`msg${grouped ? ' msg--grouped' : ''}${tint ? ' msg--bubble' : ''}`} aria-label={`${p.name} at ${msg.time}`} style={{ ['--msg-avatar' as string]: `${avatarSize}px`, ...(tint ? { ['--bubble' as string]: tintVar(tint) } : {}) }}>
      <div className="msg__avatar">
        {grouped ? <span className="ds-sr-only">{p.name}</span> : <PersonAvatar name={p.name} size={avatarSize} shape={p.bot ? 'square' : 'circle'} status={p.bot ? undefined : p.status} />}
      </div>
      <div className="msg__main">
        {!grouped && (
          <header className="msg__head">
            <strong className="msg__name">{p.name}</strong>
            {p.bot && <Tag>App</Tag>}
            <time className="ds-muted">{msg.time}</time>
          </header>
        )}
        <p className="msg__body">{rich(msg.body)}</p>
        {msg.candidate && (
          <Card variant="flat" size="dense" className="msg__candidate">
            <div className="msg__candidate-head">
              <strong>{msg.candidate.name}</strong>
              <Tag tone="info" dot>{msg.candidate.stage}</Tag>
            </div>
            <span className="ds-muted">{msg.candidate.role}</span>
            <Meter value={msg.candidate.score} max={5} label={`Scorecard average for ${msg.candidate.name}`} />
          </Card>
        )}
        {msg.files?.map((f) => (
          <span key={f} className="msg__file"><Paperclip size="1em" aria-hidden="true" /> {f}</span>
        ))}
        {(msg.reactions?.length ?? 0) > 0 && (
          <div className="msg__reactions">
            {msg.reactions!.map((r) => (
              <span key={r.emoji} className="msg__reaction" data-mine={r.mine || undefined}>
                <span aria-hidden="true">{r.emoji}</span> {r.count}<span className="ds-sr-only"> reactions</span>
              </span>
            ))}
          </div>
        )}
        {onOpenThread && (
          <button type="button" className="msg__thread-btn" aria-pressed={threadActive} onClick={onOpenThread}>
            <ChatCircleText size="1.25em" aria-hidden="true" />
            {replyCount > 0 ? `${replyCount} ${replyCount === 1 ? 'reply' : 'replies'}` : 'Reply'}
            {lastReply && <span className="ds-muted">Last reply {lastReply}</span>}
          </button>
        )}
      </div>
    </article>
  );
}
