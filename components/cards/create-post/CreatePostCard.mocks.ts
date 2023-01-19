import { Roles } from '@/constants/roles';
import { ICreatePostCard } from './CreatePostCard';

const base: ICreatePostCard = {
  userRole: Roles.TEACHER,
};

export const mockCreatePostCardProps = {
  base,
};
