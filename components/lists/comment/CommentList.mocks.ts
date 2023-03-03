import { ICommentList } from './CommentList';

const base: ICommentList = {
  comments: [],
  handleDeleteComment: function (id: string): void {
    throw new Error('Function not implemented.');
  }
};

export const mockCommentListProps = {
  base,
};
