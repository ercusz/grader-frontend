export type User = {
  id: number;
  username: string | undefined;
  email: string;
  // provider: string;
  // confirmed: boolean;
  // blocked: boolean;
  // createdAt: string;
  // updatedAt: string;
  student_id: string | undefined;
  first_name: string | undefined;
  last_name: string | undefined;
  role: { id: number; name: string };
  profile_img: { id: number; url: string } | undefined;
};

export type Classroom = {
  id: number;
  name: string;
  semester: number;
  year: number;
  section: number;
  coverImageUrl: string;
  instructor: User;
  success: number;
  slug: string;
};

export type Section = {
  id: number;
  name: string;
};

export type TeacherClassroom = {
  id: number;
  name: string;
  semester: number;
  year: number;
  section: Section[];
  coverImageUrl: string;
  instructor: User;
  slug: string;
};

export type CreateCourseReq = {
  name: string;
  code: string;
  semester: number;
  year: number;
  teacherId: number;
  classrooms: string[];
}

export type CourseDetail = {
  name: string;
  code: string;
  semester: number;
  year: number;
};

export type CourseDetailForm = {
  name: string;
  code: string;
  semester: string;
  year: string;
};

export type CreateCourseClassroom = {
  name: string;
  students: string[];
};