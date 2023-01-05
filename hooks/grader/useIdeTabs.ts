import { Java } from '@/constants/languageTemplate';
import { atom, useAtom } from 'jotai';

export type IDETabs = {
  path: string;
  value: string;
};

export const ideTabsAtom = atom<IDETabs[]>([
  { path: 'Main.java', value: Java.template },
]);

const adder = atom(null, (_, set, newTab: IDETabs) =>
  set(ideTabsAtom, (prev: IDETabs[]) => [...prev, newTab])
);

const remover = atom(null, (get, set, index: number) =>
  set(
    ideTabsAtom,
    get(ideTabsAtom).filter((_, idx) => idx !== index)
  )
);

export function useIdeTabs() {
  const [ideTabs, setIdeTabs] = useAtom(ideTabsAtom);
  const [, addIdeTab] = useAtom(adder);
  const [, removeIdeTab] = useAtom(remover);

  return { ideTabs, setIdeTabs, addIdeTab, removeIdeTab } as const;
}
