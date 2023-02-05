import { Assignment } from '@/types/types';
import { atom } from 'jotai';

export const openEditTopicDialogAtom = atom(false);
export const defaultLeftAtom = atom<Assignment[]>([]);
export const defaultRightAtom = atom<Assignment[]>([]);
