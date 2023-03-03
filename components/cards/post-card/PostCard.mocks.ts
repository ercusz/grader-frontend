import { IPostCard } from './PostCard';

const base: IPostCard = {
  post: {
    id: 1,
    classroomId: 1,
    content: 'ทดสอบโพสต์ 1',
    isPinned: false,
    createdAt: new Date(
      new Date().valueOf() - 1000 * 60 * 60 * 24 * 4
    ).toISOString(),
    createBy: {
      id: 999,
      firstName: 'Somsak',
      lastName: 'Chicken',
      username: 'somsak999',
      profileImage: {
        id: 213423,
        url: 'https://i.pravatar.cc/?u=somsak999',
      },
    },
    updatedAt: new Date(
      new Date().valueOf() - 1000 * 60 * 60 * 24 * 4
    ).toISOString(),
    comments: [],
  },
  classroomSlug: '',
};

export const mockPostCardProps = {
  base,
};
