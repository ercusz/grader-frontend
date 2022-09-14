import { CreateCourseReq } from '../types/types';
import { contentHttpClient, Response } from './APIHelper';

export const getClassrooms = async (token: string | undefined) => {
  if (!token) return;

  const { res, err }: Response = await contentHttpClient.get(
    '/api/classrooms/me',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (err) {
    return;
  }

  return res.data;
};

export const getTeacherClassrooms = async (token: string | undefined) => {
  if (!token) return;

  const { res, err }: Response = await contentHttpClient.get(
    '/api/classrooms/teacher/me',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (err) {
    return;
  }

  return res.data;
};

export const createCourse = async (token: string | undefined, courseData: CreateCourseReq) => {
  if (!token) return;

  const { res, err }: Response = await contentHttpClient.post(
    '/api/course/create',
    courseData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (err) {
    return;
  }

  return res.data;
}