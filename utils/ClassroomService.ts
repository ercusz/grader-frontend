import { Classroom, Course, CreateCourseReq } from '@/types/types';
import { contentHttpClient, Response } from './APIHelper';

export const getClassrooms = async (): Promise<Classroom[]> => {
  const { res }: Response = await contentHttpClient.get('/api/classrooms/me');

  return res.data as Classroom[];
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

export const getCourses = async (): Promise<Course[]> => {
  const { res }: Response = await contentHttpClient.get('/api/courses/me');

  return res.data as Course[];
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

export const filterData = (
  classrooms: (Course | Classroom)[],
  filter: string
): Course[] | Classroom[] => {
  return classrooms.filter((classroom: any) => {
    filter = filter.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    const rule = new RegExp(filter, 'i');

    return (
      rule.test(classroom.name) ||
      rule.test(
        classroom.instructor.firstName ? classroom.instructor.firstName : ''
      ) ||
      rule.test(
        classroom.instructor.lastName ? classroom.instructor.lastName : ''
      )
    );
  }) as Course[] | Classroom[];
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
