import { atom, useAtom } from 'jotai';
import { useEffect } from 'react';
import { theme } from '../../store/theme';

const browser = typeof window !== 'undefined';

const themeAtom = atom(
  (get) => get(theme),
  (get, set, _arg) => set(theme, get(theme) === 'light' ? 'dark' : 'light')
);

export function useAtomTheme() {
  const [theme, setTheme] = useAtom(themeAtom);

  useEffect(() => {
    if (!browser) return;

    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
  }, [theme]);

  return [theme, setTheme] as const;
}
