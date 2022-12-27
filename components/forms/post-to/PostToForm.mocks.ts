import { postToAtom } from '@/stores/create-assignment';
import { IPostToForm } from './PostToForm';

const base: IPostToForm = {
  postToAtom: postToAtom,
  courseSlug: '',
  classroomSlug: ''
};

export const mockPostToFormProps = {
  base,
};
