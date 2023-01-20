export type User = {
  id: number;
  username: string;
  email: string;
  studentId: string | null;
  firstName: string | null;
  lastName: string | null;
  role: { id: number; name: string };
  profileImage?: { id: number; url: string } | undefined;
};

export type Image = {
  id: number;
  url: string;
};

export type UserResponse = {
  id: number;
  firstName: string | null;
  lastName: string | null;
  username: string;
  profileImage: Image | null; // unknown type
  studentId?: string | null;
};

export type Course = {
  id: number;
  code: string | null;
  name: string | null;
  semester: number | null;
  year: number | null;
  slug?: string;
  coverImage: Image | null; // unknown type
  teachers: UserResponse[];
};

export type MyCoursesResponse = Course[];

export type Classroom = {
  id: number;
  name: string | null;
  slug: string;
};

export type CourseSlugResponse = {
  classrooms: Classroom[];
} & Course;

export type MyClassroomInvitation = {
  id: number;
  expireDate: Date;
  classroom: Classroom & {
    course: Course;
  };
};

export type MyClassroom = {
  success: number;
  course: Course;
} & Classroom;

export type MyClassroomsResponse = {
  classrooms: MyClassroom[];
  invitations: MyClassroomInvitation[];
};

export type ClassroomSlugResponse = {
  inviteCode: string;
  enabledInviteCode: boolean;
  teacherAssistants: UserResponse[];
  students: UserResponse[];
  course: Course;
} & Classroom;

export type CreateCourseClassroom = {
  name: string;
  students?: string[];
};

export type CreateCourseReq = {
  name: string;
  code?: string | null;
  semester?: number | null;
  year?: number | null;
  classrooms?: CreateCourseClassroom[];
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

export type CreateAssignment = {
  classroomIds: number[];
  title: string;
  startDate: string;
  endDate: string;
  type: string;
  content: string;
  point: number;
  timeLimit?: number | null;
  memoryLimit?: number | null;
  testcases?: {
    name: string;
    input: string;
    expectedOutput: string;
  }[];
};

export type EditAssignment = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  type: string;
  content: string;
  point: number;
  timeLimit?: number | null;
  memoryLimit?: number | null;
  testcases?: {
    id: number;
    name: string;
    input: string;
    expectedOutput: string;
  }[];
};

export type Assignment = {
  id: number;
  classroomId: number;
  title: string;
  startDate: string;
  endDate: string;
  type: string;
  content: string;
  point: number;
  timeLimit?: number | null;
  memoryLimit?: number | null;
  testcases?: {
    id: number;
    name: string;
    input: string;
    expectedOutput: string;
  }[];
  createdAt: string;
  createBy: UserResponse;
  updatedAt: string;
  updateBy: UserResponse | null;
};

export type CreatePost = {
  classroomIds: number[];
  content: string;
};

export type Post = {
  id: number;
  classroomId: number;
  content: string;
  isPinned: boolean;
  createdAt: string;
  createBy: UserResponse;
  updatedAt: string;
};
