import { contentHttpClient, Response } from './APIHelper';

export const editComment = async (
  commentId: string,
  content: string
): Promise<void> => {
  const { err }: Response = await contentHttpClient.patch(
    `/api/comments/${commentId}`,
    {
      content,
    }
  );

  if (err) {
    throw new Error('edit comment failed');
  }
};

export const createPostComment = async (
  classroomId: string,
  postId: string,
  content: string
): Promise<void> => {
  const { err }: Response = await contentHttpClient.post(
    `/api/classrooms/${classroomId}/posts/${postId}/comments`,
    {
      content: content,
    }
  );

  if (err) {
    throw new Error('create comment failed');
  }
};

export const deletePostComment = async (
  classroomId: string,
  postId: string,
  commentId: string
): Promise<void> => {
  const { err }: Response = await contentHttpClient.delete(
    `/api/classrooms/${classroomId}/posts/${postId}/comments/${commentId}`
  );

  if (err) {
    throw new Error('delete comment failed');
  }
};
