import {
  CreateCourseClassroom,
  CreateCourseReq,
  MyClassroomsResponse,
  MyCoursesResponse,
  UserResponse,
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
    '/api/courses',
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
    `/api/classrooms/${id}/reset-invite-code`
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
    `/api/classrooms/${id}/toggle-invite-code`,
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
    `/api/courses/${id}`,
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
      `/api/courses/${id}`,
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
    `/api/classrooms/${id}`,
    data
  );

  if (err) {
    throw new Error('Update classroom details failed.');
  }
};

export const deleteCourse = async (id: number) => {
  const { err }: Response = await contentHttpClient.delete(
    `/api/courses/${id}`
  );

  if (err) {
    throw new Error('Delete course failed.');
  }
};

export const deleteClassroom = async (id: number) => {
  const { err }: Response = await contentHttpClient.delete(
    `/api/classrooms/${id}`
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
    `/api/courses/${courseId}/classrooms`,
    {
      classrooms: classrooms,
    }
  );

  if (err) {
    throw new Error('Add classrooms failed.');
  }
};

export const responseClassroomInvitation = async (
  id: number,
  isAccepted: boolean
) => {
  const { res, err }: Response = await contentHttpClient.patch(
    `/api/classroom-invitation/response/${id}`,
    {
      isAccepted: isAccepted,
    }
  );

  if (err) {
    throw new Error('Response classroom invitation failed.');
  }

  if (res.status === 200) {
    return isAccepted;
  }

  return false;
};

export const joinClassroomByInviteCode = async (inviteCode: string) => {
  const { err }: Response = await contentHttpClient.post(
    `/api/classroom/join`,
    {
      inviteCode: inviteCode,
    }
  );
  if (err) {
    throw new Error('Join classroom failed.');
  }
};

export const removeStudentFromClassroom = async (
  studentId: number,
  classroomId: number
) => {
  const { err }: Response = await contentHttpClient.delete(
    `/api/classrooms/${classroomId}/students/${studentId}`
  );
  if (err) {
    throw new Error('Remove student from classroom failed.');
  }
};

export const removeStudentsFromClassroom = async (
  students: UserResponse[],
  classroomId: number
) => {
  for (let i = 0; i < students.length; i++) {
    await removeStudentFromClassroom(students[i].id, classroomId);
  }
};

export const removeTaFromClassroom = async (
  taId: number,
  classroomId: number
) => {
  const { err }: Response = await contentHttpClient.delete(
    `/api/classrooms/${classroomId}/teacher-assistants/${taId}`
  );
  if (err) {
    throw new Error('Remove teacher assistant from classroom failed.');
  }
};

export const removeTasFromClassroom = async (
  tas: UserResponse[],
  classroomId: number
) => {
  for (let i = 0; i < tas.length; i++) {
    await removeTaFromClassroom(tas[i].id, classroomId);
  }
};

export interface IFindUser {
  email?: string;
  username?: string;
  studentId?: string;
}
export const findUser = async (keyword: IFindUser) => {
  const { email, username, studentId } = keyword;

  const { res, err }: Response = await contentHttpClient.get(
    `/api/users?filters[${
      (email && 'email') ||
      (username && 'username') ||
      (studentId && 'studentId')
    }][$containsi]=${
      (email && email) || (username && username) || (studentId && studentId)
    }`
  );
  if (err) {
    throw new Error('Find user data failed.');
  }

  return res.data;
};

export const addTaToClassroom = async (taId: number, classroomId: number) => {
  const { err }: Response = await contentHttpClient.post(
    `/api/classrooms/${classroomId}/teacher-assistants`,
    {
      teacherAssistantId: taId,
    }
  );
  if (err) {
    throw new Error('Add teacher assistant to classroom failed.');
  }
};

export const addStudentToClassroom = async (
  studentId: number,
  classroomId: number
) => {
  const { err }: Response = await contentHttpClient.post(
    `/api/classrooms/${classroomId}/students`,
    {
      studentId: studentId,
    }
  );
  if (err) {
    throw new Error('Add student to classroom failed.');
  }
};

export const inviteStudentsToClassroom = async (
  students: string[],
  classroomId: number,
  expireDate?: Date
) => {
  const { err }: Response = await contentHttpClient.post(
    `/api/classroom-invitation/create`,
    {
      students: students,
      classroomId: classroomId,
      expireDate: expireDate ? expireDate.toISOString() : null,
    }
  );
  if (err) {
    throw new Error('Invite students to classroom failed.');
  }
};

export const leaveClassroom = async (classroomId: number) => {
  const { err }: Response = await contentHttpClient.delete(
    `/api/classrooms/${classroomId}/leave`
  );
  if (err) {
    throw new Error('Leave classroom failed.');
  }
};
