import { PostTo } from '@/types/types';
import { atom } from 'jotai';

export const openEditMaterialDialogAtom = atom(false);
export const postToAtom = atom<PostTo[]>([]);
