import { postToAtom } from '@/stores/create-assignment';
import { ITopicForm } from './TopicForm';

const base: ITopicForm = {
  postToAtom: postToAtom,
};

export const mockTopicFormProps = {
  base,
};
