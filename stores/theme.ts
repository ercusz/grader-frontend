import { atomWithStorage } from 'jotai/utils';
const browser = typeof window !== 'undefined';

export type Theme = 'light' | 'dark';

export const theme = atomWithStorage<Theme>(
  'theme-color',
  browser && matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
);
