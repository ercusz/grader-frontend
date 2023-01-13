import { Assignment } from '@/types/types';
import { getAssignmentById, getAssignments } from '@/utils/AssignmentService';
import { useQuery } from '@tanstack/react-query';

export const useAssignments = ({ classroomId }: { classroomId?: string }) =>
  useQuery(
    ['assignments', { classroomId: classroomId }],
    () => getAssignments(classroomId ? classroomId : ''),
    {
      enabled: Boolean(classroomId),
    }
  );

export const useAssignment = ({ id }: { id?: string }) =>
  useQuery<Assignment, Error>(
    ['assignment', { id: id }],
    () => getAssignmentById(id ? id : ''),
    {
      enabled: Boolean(id),
    }
  );
