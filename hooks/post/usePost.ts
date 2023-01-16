import { Post } from '@/types/types';
import { getPostById, getPosts } from '@/utils/PostService';
import { useQuery } from '@tanstack/react-query';

export const usePosts = ({ classroomId }: { classroomId?: string }) =>
  useQuery(
    ['posts', { classroomId: classroomId }],
    () => getPosts(classroomId ? classroomId : ''),
    {
      enabled: Boolean(classroomId),
    }
  );

export const usePost = ({ id }: { id?: string }) =>
  useQuery<Post, Error>(['post', { id: id }], () => getPostById(id ? id : ''), {
    enabled: Boolean(id),
  });
