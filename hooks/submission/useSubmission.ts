import { UserSubmissionResponse } from '@/types/types';
import {
  getUserSubmissionPage,
  getUserSubmissions,
} from '@/utils/SubmissionService';
import { useQuery } from '@tanstack/react-query';

export const useUserSubmissions = ({
  classroomId,
  assignmentId,
  userId,
}: {
  classroomId?: string;
  assignmentId?: string;
  userId?: string;
}) =>
  useQuery<UserSubmissionResponse, Error>(
    ['submissions', { assignmentId: assignmentId, userId: userId }],
    () =>
      getUserSubmissions(
        assignmentId ? assignmentId : '',
        classroomId ? classroomId : ''
      ),
    {
      enabled: Boolean(classroomId) && Boolean(assignmentId) && Boolean(userId),
    }
  );

export const useUserSubmissionPages = ({
  classroomId,
  assignmentId,
  userId,
  page,
}: {
  classroomId?: string;
  assignmentId?: string;
  userId?: string;
  page: number;
}) =>
  useQuery<UserSubmissionResponse, Error>(
    ['submissions', { assignmentId: assignmentId, userId: userId, page: page }],
    () =>
      getUserSubmissionPage(
        assignmentId ? assignmentId : '',
        classroomId ? classroomId : '',
        page
      ),
    {
      enabled: Boolean(classroomId) && Boolean(assignmentId) && Boolean(userId),
      keepPreviousData: true,
    }
  );