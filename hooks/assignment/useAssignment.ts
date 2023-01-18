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

export const useAssignment = ({
  classroomId,
  assignmentId,
}: {
  assignmentId?: string;
  classroomId?: string;
}) =>
  useQuery<Assignment, Error>(
    ['assignment', { id: assignmentId }],
    () =>
      getAssignmentById(
        assignmentId ? assignmentId : '',
        classroomId ? classroomId : ''
      ),
    {
      enabled: Boolean(classroomId) && Boolean(assignmentId),
    }
  );
