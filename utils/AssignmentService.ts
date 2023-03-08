import {
  Assignment,
  AssignmentOverview,
  ClassroomAssignments,
  CreateAssignment,
  EditAssignment,
} from '@/types/types';
import { contentHttpClient, Response } from './APIHelper';
import { exportSpreadsheet } from './ExportService';

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

export const getAssignmentsOverview = async (
  classroomId: string
): Promise<AssignmentOverview[]> => {
  const { res, err }: Response = await contentHttpClient.get(
    `/api/classrooms/${classroomId}/assignments/overview`
  );
  if (err) {
    throw new Error('get assignment data failed');
  }

  return res.data as AssignmentOverview[];
};

export const exportAssignmentOverview = async (
  classroomId: string,
  assignmentId: string
) => {
  try {
    const { res, err }: Response = await contentHttpClient.get(
      `/api/classrooms/${classroomId}/assignments/${assignmentId}/overview/export`
    );

    if (err) {
      throw new Error('Export assignment overview failed');
    }

    if (res.data) {
      await exportSpreadsheet(res.data);
    }
  } catch (err) {
    throw new Error('Export assignment overview failed');
  }
};

export const exportAllAssignmentOverview = async (classroomId: string) => {
  try {
    const { res, err }: Response = await contentHttpClient.get(
      `/api/classrooms/${classroomId}/assignments/overview/export`
    );

    if (err) {
      throw new Error('Export assignment overview failed');
    }

    if (res.data) {
      await exportSpreadsheet(res.data);
    }
  } catch (err) {
    alert('เกิดข้อผิดพลาดในการสร้างไฟล์');
    throw new Error('Export assignment overview failed');
  }
};
