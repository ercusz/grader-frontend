import { Roles } from '@/constants/roles';
import { User, UserResponse } from '@/types/types';

interface IGetRole {
  teachers: UserResponse[];
  teacherAssistants: UserResponse[];
  students: UserResponse[];
  targetUser: UserResponse | User;
}

export function getUserRole({
  teachers,
  teacherAssistants,
  students,
  targetUser,
}: IGetRole): Roles {
  if (teachers.some((teacher) => teacher.id === targetUser.id)) {
    return Roles.TEACHER;
  }

  if (teacherAssistants.some((ta) => ta.id === targetUser.id)) {
    return Roles.TA;
  }

  if (students.some((student) => student.id === targetUser.id)) {
    return Roles.STUDENT;
  }

  return Roles.NIC;
}
