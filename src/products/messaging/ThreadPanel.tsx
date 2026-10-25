import { useEffect, useRef } from 'react';
import { Composer } from './Composer';
import { MessageItem } from './MessageItem';
import type { Message } from './data';

type Props = {
  root: Message;
  replies: Message[];
  onReply: (text: string, files: string[]) => void;
  composerVariant?: 'dock' | 'card' | 'pill';
};

/** Thread body: root message, replies, reply composer. The container supplies the title and close button. */
export function ThreadPanel({ root, replies, onReply, composerVariant = 'pill' }: Props) {
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ block: 'end' }); }, [replies.length]);
  return (
    <section className="thread" aria-label={`Thread on message from ${root.time}`}>
      <div className="thread__scroll">
        <MessageItem msg={root} />
        <div className="thread__divider" role="separator" aria-label={`${replies.length} replies`}>
          <span>{replies.length} {replies.length === 1 ? 'reply' : 'replies'}</span>
        </div>
        <div role="log" aria-live="polite" aria-label="Replies">
          {replies.map((r) => <MessageItem key={r.id} msg={r} />)}
        </div>
        <div ref={end} />
      </div>
      <div className="thread__compose">
        <Composer label="Reply in thread" placeholder="Reply in thread" variant={composerVariant} onSend={onReply} />
      </div>
    </section>
  );
}
