import { Post } from '@/types/types';
import { contentHttpClient, Response } from './APIHelper';

export const getPosts = async (classroomId: string): Promise<Post[]> => {
  const { res, err }: Response = await contentHttpClient.get(
    `/api/classrooms/${classroomId}/posts`
  );
  if (err) {
    throw new Error('get post data failed');
  }

  return res.data as Post[];
};

export const getPostById = async (postId: string): Promise<Post> => {
  const { res, err }: Response = await contentHttpClient.get(
    `/api/posts/${postId}`
  );
  if (err) {
    throw new Error('get post data failed');
  }

  return res.data as Post;
};
