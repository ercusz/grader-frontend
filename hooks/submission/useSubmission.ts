import { UserJavaSrcSubmissionResponse } from '@/types/types';
import {
  getUserJavaSrcSubmissionPage,
  getUserJavaSrcSubmissions,
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
  useQuery<UserJavaSrcSubmissionResponse, Error>(
    ['submissions', { assignmentId: assignmentId, userId: userId }],
    () =>
      getUserJavaSrcSubmissions(
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
  useQuery<UserJavaSrcSubmissionResponse, Error>(
    ['submissions', { assignmentId: assignmentId, userId: userId, page: page }],
    () =>
      getUserJavaSrcSubmissionPage(
        assignmentId ? assignmentId : '',
        classroomId ? classroomId : '',
        page
      ),
    {
      enabled: Boolean(classroomId) && Boolean(assignmentId) && Boolean(userId),
      keepPreviousData: true,
    }
  );
