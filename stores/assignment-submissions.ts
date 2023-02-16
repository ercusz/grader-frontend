import { atom } from 'jotai';

export const selectedSubmissionsAtom = atom<number[]>([]);

export const enabledPointDeductionAtom = atom<boolean>(true);
