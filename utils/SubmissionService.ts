import { CreateSubmission, UserSubmissionResponse } from '@/types/types';
import { contentHttpClient, Response } from './APIHelper';

export const createSubmission = async (
  body: CreateSubmission,
  classroomId: string,
  assignmentId: string
) => {
  const { err }: Response = await contentHttpClient.post(
    `api/classrooms/${classroomId}/assignments/${assignmentId}/submissions`,
    body
  );

  if (err) {
    throw new Error('create submission failed.');
  }
};

export const getUserSubmissions = async (
  assignmentId: string,
  classroomId: string
): Promise<UserSubmissionResponse> => {
  const { res, err }: Response = await contentHttpClient.get(
    `/api/classrooms/${classroomId}/assignments/${assignmentId}/submissions`
  );
  if (err) {
    throw new Error('get user submission data failed');
  }

  return res.data as UserSubmissionResponse;
};

export const getUserSubmissionPage = async (
  assignmentId: string,
  classroomId: string,
  page: number
): Promise<UserSubmissionResponse> => {
  const { res, err }: Response = await contentHttpClient.get(
    `/api/classrooms/${classroomId}/assignments/${assignmentId}/submissions?start=${page}&limit=5`
  );
  if (err) {
    throw new Error('get user submission data failed');
  }

  return res.data as UserSubmissionResponse;
};
