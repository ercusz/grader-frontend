import { Assignment } from '@/types/types';
import { contentHttpClient, Response } from './APIHelper';

export const getAssignments = async (
  classroomId: string
): Promise<Assignment[]> => {
  const { res, err }: Response = await contentHttpClient.get(
    `/api/classrooms/${classroomId}/assignments`
  );
  if (err) {
    throw new Error('get assignment data failed');
  }

  return res.data as Assignment[];
};

export const getAssignmentById = async (
  assignmentId: string,
  classroomId: string
): Promise<Assignment> => {
  const { res, err }: Response = await contentHttpClient.get(
    `/api/classrooms/${classroomId}/assignments/${assignmentId}`
  );
  if (err) {
    throw new Error('get assignment data failed');
  }

  return res.data as Assignment;
};
