export type User = {
  id: number;
  username: string;
  email: string;
  studentId: string | null;
  firstName: string | null;
  lastName: string | null;
  role: { id: number; name: string };
  profileImage: { id: number; url: string } | undefined;
};

export type Classroom = {
  id: number;
  name: string;
  semester: number;
  year: number;
  section: string;
  coverImageUrl: string;
  instructor: User;
  success: number;
  slug: string;
};

export type Section = {
  id: number;
  name: string;
  // slug: string;
};

export type Course = {
  id: number;
  name: string;
  // code: string;
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
};

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

export type Submission = {
  stdout: string;
  status_id: number;
  time: number;
  memory: number;
  stderr: string;
  compile_output: string;
};

export type TestCase = {
  id: number;
  name: string;
  input: string;
  expectedOutput: string;
  status: number;
  loading: boolean;
};
