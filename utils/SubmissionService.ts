import {
  CreateJavaSrcSubmission,
  UserJavaSrcSubmissionResponse,
} from '@/types/types';
import { contentHttpClient, Response } from './APIHelper';

export const createJavaSrcSubmission = async (
  body: CreateJavaSrcSubmission,
  classroomId: string,
  assignmentId: string
) => {
  const { err }: Response = await contentHttpClient.post(
    `api/classrooms/${classroomId}/assignments/${assignmentId}/submissions/java-src`,
    body
  );

  if (err) {
    throw new Error('create submission failed.');
  }
};

export const getUserJavaSrcSubmissions = async (
  assignmentId: string,
  classroomId: string
): Promise<UserJavaSrcSubmissionResponse> => {
  const { res, err }: Response = await contentHttpClient.get(
    `/api/classrooms/${classroomId}/assignments/${assignmentId}/submissions/java-src`
  );
  if (err) {
    throw new Error('get user submission data failed');
  }

  return res.data as UserJavaSrcSubmissionResponse;
};

export const getUserJavaSrcSubmissionPage = async (
  assignmentId: string,
  classroomId: string,
  page: number
): Promise<UserJavaSrcSubmissionResponse> => {
  const { res, err }: Response = await contentHttpClient.get(
    `/api/classrooms/${classroomId}/assignments/${assignmentId}/submissions/java-src?start=${page}&limit=5`
  );
  if (err) {
    throw new Error('get user submission data failed');
  }

  return res.data as UserJavaSrcSubmissionResponse;
};
