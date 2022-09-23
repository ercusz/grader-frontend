import { Classroom, Course, CreateCourseReq } from '../types/types';
import { contentHttpClient, Response } from './APIHelper';

export const getClassrooms = async (filter?: string): Promise<Classroom[]> => {
  const { res }: Response = await contentHttpClient.get('/api/classrooms/me');

  if (filter) {
    return filterData(res.data, filter) as Classroom[];
  }

  return res.data as Classroom[];
};

export const getCourses = async (filter?: string): Promise<Course[]> => {
  const { res }: Response = await contentHttpClient.get('/api/courses/me');

  if (filter) {
    return filterData(res.data, filter) as Course[];
  }

  return res.data as Course[];
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
        classroom.instructor.first_name ? classroom.instructor.first_name : ''
      ) ||
      rule.test(
        classroom.instructor.last_name ? classroom.instructor.last_name : ''
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
