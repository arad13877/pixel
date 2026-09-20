import type { CSSProperties } from 'react';
export type IconName = 'arrow' | 'spark' | 'globe' | 'check' | 'menu' | 'close' | 'chat' | 'layers' | 'search' | 'sales' | 'support' | 'marketing' | 'custom' | 'chevron' | 'plus' | 'code';
const paths: Record<IconName, string> = {
  arrow: 'M19 12H5m6-6-6 6 6 6',
  spark: 'm12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z',
  globe: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18Z',
  check: 'm5 12 4 4L19 6',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'm6 6 12 12M6 18 18 6',
  chat: 'M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-2 2V11.5A9.5 9.5 0 0 1 21 11.5ZM7 11h.01M12 11h.01M17 11h.01',
  layers: 'm12 3 10 5-10 5L2 8l10-5Zm-10 9 10 5 10-5M2 16l10 5 10-5',
  search: 'M16 10a6 6 0 1 1-12 0 6 6 0 0 1 12 0Zm-1 5 6 6',
  sales: 'M3 17 9 11l4 4 8-11m-6 0h6v6M3 21h18',
  support: 'M4 14v-3a8 8 0 0 1 16 0v3M4 11H2v7h4v-7H4Zm16 0h2v7h-4v-7h2Zm0 7v3h-7',
  marketing: 'm3 10 17-6v16L3 14v-4Zm4 6 2 5h3l-2-4M20 9h2v6h-2',
  custom: 'm8 4-6 8 6 8M16 4l6 8-6 8M14 3l-4 18',
  chevron: 'm8 10 4 4 4-4',
  plus: 'M12 5v14M5 12h14',
  code: 'm7 8-4 4 4 4m10-8 4 4-4 4M14 5l-4 14',
};
export function Icon({ name, size = 20, style }: { name: IconName; size?: number; style?: CSSProperties }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={style}><path d={paths[name]} /></svg>;
}
