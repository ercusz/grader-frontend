import { PostTo } from '@/types/types';
import { atom } from 'jotai';

export const openEditAssignmentDialogAtom = atom(false);
export const postToAtom = atom<PostTo[]>([]);
