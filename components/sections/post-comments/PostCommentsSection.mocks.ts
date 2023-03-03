import { IPostCommentsSection } from './PostCommentsSection';

const base: IPostCommentsSection = {
  post: {
    id: 0,
    classroomId: 0,
    content: '',
    isPinned: false,
    createdAt: '',
    createBy: {
      id: 0,
      firstName: null,
      lastName: null,
      username: '',
      profileImage: null,
      studentId: undefined,
    },
    updatedAt: '',
    comments: [],
  },
  classroomSlug: '',
};

export const mockPostCommentsSectionProps = {
  base,
};
