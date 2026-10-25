export type Tint = 'sky' | 'ice' | 'stone' | 'cream' | 'sage' | 'peach' | 'butter' | 'lilac';
export const TINTS: Tint[] = ['sky', 'ice', 'cream', 'sage', 'peach', 'butter', 'lilac', 'stone'];
export const tintVar = (t: Tint) => `var(--ds-tint-${t})`;

/** Deterministic pastel from a name, so the same person always gets the same colour. */
export function tintForName(name: string): Tint {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return TINTS[h % TINTS.length];
}
