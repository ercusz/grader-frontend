import { CreatePost, EditPost, Post } from '@/types/types';
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

export const createPosts = async (post: CreatePost) => {
  const { err }: Response = await contentHttpClient.post(`/api/posts`, post);

  if (err) {
    throw new Error('create posts failed.');
  }
};

export const editPost = async (post: EditPost) => {
  const { err }: Response = await contentHttpClient.patch(
    `/api/classrooms/${post.classroomId}/posts/${post.id}`,
    {
      content: post.content,
    }
  );

  if (err) {
    throw new Error('update post failed.');
  }
};

export const setPinPost = async (
  classroomId: string,
  postId: string,
  pinState: boolean
) => {
  const { err }: Response = await contentHttpClient.patch(
    `/api/classrooms/${classroomId}/posts/${postId}/pin`,
    {
      isPinned: pinState,
    }
  );

  if (err) {
    throw new Error('update pin post failed.');
  }
};

export const deletePost = async (classroomId: string, postId: string) => {
  const { err }: Response = await contentHttpClient.delete(
    `/api/classrooms/${classroomId}/posts/${postId}`
  );

  if (err) {
    throw new Error('delete post failed.');
  }
};
