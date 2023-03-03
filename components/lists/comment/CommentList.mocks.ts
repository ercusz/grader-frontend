import { ICommentList } from './CommentList';

const base: ICommentList = {
  comments: [],
  handleOpenMenu: function (id: number): void {
    throw new Error('Function not implemented.');
  }
};

export const mockCommentListProps = {
  base,
};
