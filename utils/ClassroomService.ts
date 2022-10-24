import {
  CreateCourseClassroom,
  CreateCourseReq,
  MyClassroomsResponse,
  MyCoursesResponse,
} from '@/types/types';
import { contentHttpClient, Response } from './APIHelper';
import { uploadImage } from './UploadService';

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
    throw new Error('create course failed');
  }

  return res.data;
};

export const resetClassroomInviteCode = async (
  id: number
): Promise<Boolean> => {
  const { err }: Response = await contentHttpClient.patch(
    `/api/classroom/reset-invite-code/${id}`
  );
  if (err) {
    return false;
  }

  return true;
};

export const toggleClassroomInviteCode = async (
  id: number,
  state: boolean
): Promise<Boolean> => {
  const { err }: Response = await contentHttpClient.patch(
    `/api/classroom/toggle-invite-code/${id}`,
    {
      currentState: state,
    }
  );
  if (err) {
    return false;
  }

  return true;
};

export const updateCourseInfo = async (data: CreateCourseReq, id: number) => {
  const { err }: Response = await contentHttpClient.patch(
    `/api/course/${id}`,
    data
  );

  if (err) {
    throw new Error('Update course details failed.');
  }
};

export const updateCourseCoverImage = async (file: File, id: number) => {
  try {
    const coverImage = await uploadImage(file);
    const { err }: Response = await contentHttpClient.patch(
      `/api/course/${id}`,
      {
        coverImage: coverImage,
      }
    );

    if (err) {
      throw new Error('Update cover image failed.');
    }
  } catch (err) {
    throw new Error('Update cover image failed.');
  }
};

export const updateClassroomInfo = async (
  data: { name: string },
  id: number
) => {
  const { err }: Response = await contentHttpClient.patch(
    `/api/classroom/${id}`,
    data
  );

  if (err) {
    throw new Error('Update classroom details failed.');
  }
};

export const deleteCourse = async (id: number) => {
  const { err }: Response = await contentHttpClient.delete(`/api/course/${id}`);

  if (err) {
    throw new Error('Delete course failed.');
  }
};

export const deleteClassroom = async (id: number) => {
  const { err }: Response = await contentHttpClient.delete(
    `/api/classroom/${id}`
  );

  if (err) {
    throw new Error('Delete classroom failed.');
  }
};

export const addClassrooms = async (
  classrooms: CreateCourseClassroom[],
  courseId: number
) => {
  const { err }: Response = await contentHttpClient.post(
    '/api/classrooms/create',
    {
      courseId: courseId,
      classrooms: classrooms,
    }
  );

  if (err) {
    throw new Error('Add classrooms failed.');
  }
};
