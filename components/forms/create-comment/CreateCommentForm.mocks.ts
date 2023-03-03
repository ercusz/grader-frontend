import { ICreateCommentForm } from './CreateCommentForm';

const base: ICreateCommentForm = {
  onSubmit: function (content: string): void {
    throw new Error('Function not implemented.');
  },
};

export const mockCreateCommentFormProps = {
  base,
};
