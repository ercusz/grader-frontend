import {
  AssignmentSubmissions,
  CreateJavaSrcSubmission,
  StudentSubmission,
  UserJavaSrcSubmissionResponse,
} from '@/types/types';
import { contentHttpClient, Response } from './APIHelper';
import { studentSubmissionExtensions, uploadFiles } from './UploadService';

export const createJavaSrcSubmission = async (
  body: CreateJavaSrcSubmission,
  classroomId: string,
  assignmentId: string
) => {
  const { err }: Response = await contentHttpClient.post(
    `/api/classrooms/${classroomId}/assignments/${assignmentId}/submissions/java-src`,
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

export const getAssignmentSubmissions = async (
  assignmentId: string,
  classroomId: string
): Promise<AssignmentSubmissions> => {
  const { res, err }: Response = await contentHttpClient.get(
    `/api/classrooms/${classroomId}/assignments/${assignmentId}/submissions`
  );
  if (err) {
    throw new Error('get assignment submission data failed');
  }

  return res.data as AssignmentSubmissions;
};

export const getAssignmentLatestStudentSubmission = async (
  assignmentId: string,
  classroomId: string,
  studentId: string
): Promise<StudentSubmission> => {
  const { res, err }: Response = await contentHttpClient.get(
    `/api/classrooms/${classroomId}/assignments/${assignmentId}/students/${studentId}/submissions/latest`
  );
  if (err) {
    throw new Error('get assignment submission data failed');
  }

  return res.data as StudentSubmission;
};

export const submitStudentSubmission = async (
  assignmentId: string,
  classroomId: string,
  files: File[]
) => {
  try {
    let reqBody = {
      files: [],
    };

    if (files.length > 0) {
      const uploadedFiles = await uploadFiles(
        files,
        studentSubmissionExtensions
      );

      if (!uploadedFiles || uploadedFiles.length === 0) {
        throw new Error('Cannot upload files to server');
      }

      reqBody['files'] = uploadedFiles;
    }

    const { err }: Response = await contentHttpClient.post(
      `/api/classrooms/${classroomId}/assignments/${assignmentId}/submissions/docs`,
      reqBody
    );

    if (err) {
      throw new Error('Create student submission failed');
    }
  } catch (err) {
    throw new Error('Create student submission failed');
  }
};
