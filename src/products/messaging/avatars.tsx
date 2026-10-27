import type { ComponentProps } from 'react';
import { Avatar, type Tint } from '../../../design-system';
import { ME } from './data';

/**
 * Illustrated profile pictures for the fictional team, drawn as small flat SVGs (no real photos, nothing to download).
 * The colours here are illustration data, not interface colours, so they sit outside the design tokens.
 */
type Look = { bg: string; skin: string; hair: string; shirt: string; style: 'short' | 'puff' | 'long' | 'bun' | 'side'; glasses?: boolean };

const looks: Record<string, Look> = {
  'Jules Mehta': { bg: '#a8dcff', skin: '#e0ac8a', hair: '#2b2118', shirt: '#3b6ea8', style: 'short' },
  'Mira Okafor': { bg: '#f9bfa3', skin: '#8d5a3c', hair: '#1a1210', shirt: '#c2410c', style: 'puff' },
  'Dev Sharma': { bg: '#d3dcb4', skin: '#c68863', hair: '#121212', shirt: '#2f6f4f', style: 'short', glasses: true },
  'Anika Rao': { bg: '#c3b4f2', skin: '#f0c7a8', hair: '#5a3322', shirt: '#7a5fc7', style: 'long' },
  'Tomas Berg': { bg: '#f8d56e', skin: '#f2d0b4', hair: '#8a6a3a', shirt: '#444a55', style: 'side' },
  'Priya Nair': { bg: '#fff0da', skin: '#b9794f', hair: '#0f0a08', shirt: '#b0306a', style: 'bun' },
  'Leo Park': { bg: '#d3e6ff', skin: '#e9bf9d', hair: '#222222', shirt: '#28507a', style: 'side', glasses: true },
};

function draw(l: Look) {
  const back = l.style === 'long' ? `<path d="M17 30C17 12 47 12 47 30L49 54H15Z" fill="${l.hair}"/>` : l.style === 'puff' ? `<circle cx="32" cy="21" r="14.5" fill="${l.hair}"/>` : l.style === 'bun' ? `<circle cx="32" cy="9" r="6" fill="${l.hair}"/>` : '';
  const front = l.style === 'side' ? `<path d="M20.5 27C19 12 42 10 44 24C38 20 28 19 22 28Z" fill="${l.hair}"/>` : `<path d="M20.5 27C19 13 45 13 43.5 27C40 20.5 24 20.5 20.5 27Z" fill="${l.hair}"/>`;
  const glasses = l.glasses ? '<g fill="none" stroke="#222" stroke-width="1.1"><circle cx="27.5" cy="29" r="3.6"/><circle cx="36.5" cy="29" r="3.6"/><path d="M31 29h2"/></g>' : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="${l.bg}"/>${back}<path d="M8 64C8 49 20 44 32 44s24 5 24 20Z" fill="${l.shirt}"/><rect x="28" y="36" width="8" height="11" rx="3" fill="${l.skin}"/><ellipse cx="32" cy="28" rx="11" ry="13" fill="${l.skin}"/>${front}<circle cx="27.5" cy="29" r="1.3" fill="#222"/><circle cx="36.5" cy="29" r="1.3" fill="#222"/>${glasses}<path d="M28 35Q32 38.5 36 35" fill="none" stroke="#222" stroke-width="1.2" stroke-linecap="round"/></svg>`;
}

/** Accent for a person's text box in direct messages: you are rose, everyone else keeps one colour of their own. */
const bubbleTints: Record<string, Tint> = { dev: 'sage', mira: 'lilac', anika: 'sky', tomas: 'butter', priya: 'peach', leo: 'ice' };
export const bubbleTint = (personId: string): Tint => (personId === ME ? 'rose' : bubbleTints[personId] ?? 'stone');

const cache = new Map<string, string>();
export function avatarFor(name: string): string | undefined {
  const look = looks[name];
  if (!look) return undefined;
  if (!cache.has(name)) cache.set(name, `data:image/svg+xml;utf8,${encodeURIComponent(draw(look))}`);
  return cache.get(name);
}

/** Avatar that shows the person's picture when we have one, and falls back to initials (bots, apps). */
export function PersonAvatar(props: ComponentProps<typeof Avatar>) {
  return <Avatar {...props} src={props.src ?? avatarFor(props.name)} />;
}
