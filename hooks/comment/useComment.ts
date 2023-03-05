import { UserComment } from '@/types/types';
import {
  getAssignmentPrivateComments,
  getAssignmentPublicComments,
} from '@/utils/CommentService';
import { useQuery } from '@tanstack/react-query';

export const useAssignmentPublicComments = ({
  classroomId,
  assignmentId,
}: {
  classroomId?: string;
  assignmentId?: string;
}) =>
  useQuery<UserComment[], Error>(
    ['assignment-comments', { assignmentId: assignmentId }],
    () => getAssignmentPublicComments(classroomId ?? '', assignmentId ?? ''),
    {
      enabled: Boolean(classroomId) && Boolean(assignmentId),
    }
  );

export const useAssignmentPrivateComments = ({
  classroomId,
  assignmentId,
  hostId,
}: {
  classroomId?: string;
  assignmentId?: string;
  hostId?: string;
}) =>
  useQuery<UserComment[], Error>(
    ['assignment-comments', { assignmentId: assignmentId, hostId: hostId }],
    () =>
      getAssignmentPrivateComments(
        classroomId ?? '',
        assignmentId ?? '',
        hostId ?? ''
      ),
    {
      enabled: Boolean(classroomId) && Boolean(assignmentId) && Boolean(hostId),
    }
  );
