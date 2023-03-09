import { PostTo, UploadedFile } from '@/types/types';
import { atom } from 'jotai';

export const openCreateMaterialDialogAtom = atom(false);
export const postToAtom = atom<PostTo[]>([]);
export const filesAtom = atom<UploadedFile[] | null>(null);