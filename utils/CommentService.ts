import { UserComment } from '@/types/types';
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

export const getAssignmentPublicComments = async (
  classroomId: string,
  assignmentId: string
): Promise<UserComment[]> => {
  const { res, err }: Response = await contentHttpClient.get(
    `/api/classrooms/${classroomId}/assignments/${assignmentId}/comments`
  );
  if (err) {
    throw new Error('get assignment comments failed');
  }

  return res.data as UserComment[];
};

export const getAssignmentPrivateComments = async (
  classroomId: string,
  assignmentId: string,
  hostId: string
): Promise<UserComment[]> => {
  const { res, err }: Response = await contentHttpClient.get(
    `/api/classrooms/${classroomId}/assignments/${assignmentId}/comments/hosts/${hostId}`
  );
  if (err) {
    throw new Error('get assignment comments failed');
  }

  return res.data as UserComment[];
};

export const createAssignmentComment = async (
  classroomId: string,
  assignmentId: string,
  content: string,
  isPrivate: boolean,
  hostId?: string
): Promise<void> => {
  const tail = isPrivate ? `hosts/${hostId}` : '';
  const { err }: Response = await contentHttpClient.post(
    `/api/classrooms/${classroomId}/assignments/${assignmentId}/comments/${tail}`,
    {
      content: content,
    }
  );

  if (err) {
    throw new Error('create comment failed');
  }
};

export const deleteAssignmentComment = async (
  classroomId: string,
  assignmentId: string,
  commentId: string
): Promise<void> => {
  const { err }: Response = await contentHttpClient.delete(
    `/api/classrooms/${classroomId}/assignments/${assignmentId}/comments/${commentId}`
  );

  if (err) {
    throw new Error('delete comment failed');
  }
};

export const getMaterialComments = async (
  classroomId: string,
  materialId: string
): Promise<UserComment[]> => {
  const { res, err }: Response = await contentHttpClient.get(
    `/api/classrooms/${classroomId}/materials/${materialId}/comments`
  );
  if (err) {
    throw new Error('get material comments failed');
  }

  return res.data as UserComment[];
};

export const createMaterialComment = async (
  classroomId: string,
  materialId: string,
  content: string
): Promise<void> => {
  const { err }: Response = await contentHttpClient.post(
    `/api/classrooms/${classroomId}/materials/${materialId}/comments`,
    {
      content: content,
    }
  );

  if (err) {
    throw new Error('create comment failed');
  }
};

export const deleteMaterialComment = async (
  classroomId: string,
  materialId: string,
  commentId: string
): Promise<void> => {
  const { err }: Response = await contentHttpClient.delete(
    `/api/classrooms/${classroomId}/materials/${materialId}/comments/${commentId}`
  );

  if (err) {
    throw new Error('delete comment failed');
  }
};
