import { useCallback, useMemo, useState } from 'react';
import { channels as baseChannels, initialMessages, initialThreads, ME, type Channel, type Message, type Thread } from './data';

const nowLabel = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
let uid = 0;
const mk = (body: string, files?: string[]): Message => ({ id: `new-${++uid}`, author: ME, time: nowLabel(), body, files: files?.length ? files : undefined });

/** Local workspace state shared by all three concepts: channels, messages, threads. No backend. */
export function useWorkspace(initialChannel = 'automation') {
  const [messages, setMessages] = useState(initialMessages);
  const [threads, setThreads] = useState<Thread[]>(initialThreads);
  const [channelId, setChannelId] = useState(initialChannel);
  const [openRoot, setOpenRoot] = useState<string | null>(null);
  const [read, setRead] = useState<Set<string>>(new Set());

  const channels: Channel[] = useMemo(
    () => baseChannels.map((c) => (read.has(c.id) ? { ...c, unread: 0, mentions: 0 } : c)),
    [read],
  );
  const channel = channels.find((c) => c.id === channelId)!;

  const markRead = useCallback((id: string) => setRead((r) => new Set(r).add(id)), []);
  const selectChannel = useCallback((id: string) => { setChannelId(id); setOpenRoot(null); markRead(id); }, [markRead]);

  const send = useCallback((text: string, files?: string[]) => {
    setMessages((m) => ({ ...m, [channelId]: [...(m[channelId] ?? []), mk(text, files)] }));
  }, [channelId]);

  const reply = useCallback((rootId: string, text: string, files?: string[]) => {
    setThreads((ts) => {
      const exists = ts.some((t) => t.rootId === rootId);
      if (exists) return ts.map((t) => (t.rootId === rootId ? { ...t, replies: [...t.replies, mk(text, files)] } : t));
      return [...ts, { rootId, channelId, replies: [mk(text, files)] }];
    });
  }, [channelId]);

  const list = messages[channelId] ?? [];
  const threadFor = (rootId: string) => threads.find((t) => t.rootId === rootId);
  const root = openRoot ? list.find((m) => m.id === openRoot) ?? null : null;

  return { channels, channel, channelId, selectChannel, markRead, messages: list, allMessages: messages, threads, threadFor, openRoot, openThread: setOpenRoot, root, send, reply };
}
