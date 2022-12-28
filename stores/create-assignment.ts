import { Classroom } from '@/types/types';
import { atom } from 'jotai';

export const openCreateAssignmentDialogAtom = atom(false);
export const problemTypeAtom = atom('java-src');
export const postToAtom = atom<Classroom[]>([]);
