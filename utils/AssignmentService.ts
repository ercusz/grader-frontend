import {
  Assignment,
  ClassroomAssignments,
  CreateAssignment,
  EditAssignment,
} from '@/types/types';
import { contentHttpClient, Response } from './APIHelper';

export const addAssignments = async (assignment: CreateAssignment) => {
  const { err }: Response = await contentHttpClient.post(
    `/api/assignments`,
    assignment
  );

  if (err) {
    throw new Error('add assignments failed.');
  }
};

export const editAssignment = async (
  assignment: EditAssignment,
  classroomId: string
) => {
  const { err }: Response = await contentHttpClient.patch(
    `/api/classrooms/${classroomId}/assignments/${assignment.id}`,
    assignment
  );

  if (err) {
    throw new Error('edit assignment failed.');
  }
};

export const deleteAssignment = async (
  assignmentId: string,
  classroomId: string
) => {
  const { err }: Response = await contentHttpClient.delete(
    `/api/classrooms/${classroomId}/assignments/${assignmentId}`
  );

  if (err) {
    throw new Error('delete assignment failed.');
  }
};

export const getAssignments = async (
  classroomId: string
): Promise<ClassroomAssignments> => {
  const { res, err }: Response = await contentHttpClient.get(
    `/api/classrooms/${classroomId}/assignments`
  );
  if (err) {
    throw new Error('get assignment data failed');
  }

  return res.data as ClassroomAssignments;
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
