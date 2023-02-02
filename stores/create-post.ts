import { PostTo } from '@/types/types';
import { atom } from 'jotai';

export const openCreatePostDialogAtom = atom(false);
export const postToAtom = atom<PostTo[]>([]);
