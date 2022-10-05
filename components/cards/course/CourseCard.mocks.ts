import { ICourseCard } from './CourseCard';

const base: ICourseCard = {
  course: {
    id: 1,
    name: 'Data Structures',
    semester: 1,
    year: 2565,
    section: [
      {
        id: 1,
        name: 'Section 1',
      },
      {
        id: 2,
        name: 'Section 2',
      },
      {
        id: 3,
        name: 'Section พิเศษ',
      },
    ],
    coverImageUrl:
      'https://images.unsplash.com/photo-1640158615573-cd28feb1bf4e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    instructor: {
      id: 1234,
      username: 'johndoe69',
      email: 'johnny@kku.edu',
      studentId: null,
      firstName: 'John',
      lastName: 'Doe',
      role: {
        id: 999999,
        name: 'Teacher',
      },
      profileImage: {
        id: 1,
        url: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=80',
      },
    },
    slug: 'YXNkZm9ya3Ys',
  },
  loading: false,
};

export const mockCourseCardProps = {
  base,
};
