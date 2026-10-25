import { tintForName, tintVar, type Tint } from '../tints';

export type Status = 'online' | 'away' | 'busy' | 'offline';
type Props = {
  name: string;
  size?: number;
  shape?: 'circle' | 'square';
  status?: Status;
  tint?: Tint;
  src?: string;
};

const initials = (n: string) => n.split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase();

/** Initials on a deterministic pastel. Use shape="square" for apps and bots. Status is announced as text. */
export function Avatar({ name, size = 32, shape = 'circle', status, tint, src }: Props) {
  const label = status ? `${name}, ${status}` : name;
  return (
    <span
      className={`ds-avatar ds-avatar--${shape}`}
      style={{ width: size, height: size, fontSize: Math.max(10, size * 0.38), ['--tint' as string]: tintVar(tint ?? tintForName(name)) }}
      role="img"
      aria-label={label}
    >
      {src ? <img src={src} alt="" width={size} height={size} style={{ borderRadius: 'inherit' }} /> : initials(name)}
      {status && <span className="ds-avatar__status" data-status={status} />}
    </span>
  );
}
