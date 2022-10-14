import {
  CreateCourseReq,
  MyClassroomsResponse,
  MyCoursesResponse,
} from '@/types/types';
import { contentHttpClient, Response } from './APIHelper';

export const getClassrooms = async (): Promise<MyClassroomsResponse> => {
  const { res, err }: Response = await contentHttpClient.get(
    '/api/classrooms/me'
  );
  if (err) {
    throw new Error('get classrooms data failed');
  }

  return res.data as MyClassroomsResponse;
};

export const getClassroomBySlug = async (slug: string) => {
  const { res, err }: Response = await contentHttpClient.get(
    `/api/classroom/${slug}`
  );
  if (err) {
    throw new Error('Get classroom data failed.');
  }

  return res.data;
};

export const getCourses = async (): Promise<MyCoursesResponse> => {
  const { res, err }: Response = await contentHttpClient.get('/api/courses/me');
  if (err) {
    throw new Error('get courses data failed');
  }

  return res.data as MyCoursesResponse;
};

export const getCourseBySlug = async (slug: string) => {
  const { res, err }: Response = await contentHttpClient.get(
    `/api/course/${slug}`
  );
  if (err) {
    throw new Error('Get course data failed.');
  }

  return res.data;
};

export const filterMyClassroomsResponse = (
  data: MyClassroomsResponse,
  filter: string
): MyClassroomsResponse => {
  const { classrooms, invitations } = data;

  filter = filter.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  const rule = new RegExp(filter, 'i');

  const filteredClassrooms = classrooms.filter((classroom) => {
    return rule.test(JSON.stringify(classroom));
  });

  const filteredInvitations = invitations.filter((invitation) => {
    return rule.test(JSON.stringify(invitation));
  });

  return {
    classrooms: filteredClassrooms,
    invitations: filteredInvitations,
  } as MyClassroomsResponse;
};

export const filterMyCoursesResponse = (
  data: MyCoursesResponse,
  filter: string
): MyCoursesResponse => {
  filter = filter.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  const rule = new RegExp(filter, 'i');

  return data.filter((course) => {
    return rule.test(JSON.stringify(course));
  }) as MyCoursesResponse;
};

export const createCourse = async (courseData: CreateCourseReq) => {
  const { res, err }: Response = await contentHttpClient.post(
    '/api/course/create',
    courseData
  );

  if (err) {
    return;
  }

  return res.data;
};
