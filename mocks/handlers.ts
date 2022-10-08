import {
  ClassroomSlugResponse,
  CourseSlugResponse,
  CreateCourseReq,
  MyClassroomsResponse,
  MyCoursesResponse,
} from '@/types/types';
import { rest } from 'msw';

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_HOST;

export const handlers = [
  rest.get(`${strapiUrl}/api/classrooms/me`, (_req, res, ctx) => {
    return res(
      ctx.json<MyClassroomsResponse>({
        classrooms: [
          {
            id: 1,
            name: 'Section 1',
            slug: 'GfPz2RAAbAEt',
            success: 91.67,
            course: {
              id: 1,
              code: 'SC123456',
              name: 'Data Structures',
              semester: 1,
              year: 2565,
              coverImage: {
                id: 123,
                url: 'https://images.unsplash.com/photo-1640158615573-cd28feb1bf4e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
              },
              teachers: [
                {
                  id: 1234,
                  firstName: 'John',
                  lastName: 'Doe',
                  username: 'johndoe69',
                  profileImage: {
                    id: 1,
                    url: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=80',
                  },
                },
              ],
            },
          },
          {
            id: 2,
            name: 'เซค 3 ภาคพิเศษ',
            slug: 'aGVsbG93b3Js',
            success: 75,
            course: {
              id: 2,
              code: 'SC123457',
              name: 'Cyber Security',
              semester: 1,
              year: 2565,
              coverImage: {
                id: 1235,
                url: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80',
              },
              teachers: [
                {
                  id: 1235,
                  firstName: 'Albert',
                  lastName: 'Bob',
                  username: 'bobby',
                  profileImage: {
                    id: 34534,
                    url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1780&q=80',
                  },
                },
              ],
            },
          },
        ],
        invitations: [
          {
            id: 123,
            expireDate: new Date(),
            classroom: {
              id: 3,
              name: 'Section 2',
              slug: 'c2dvb2RieWU9',
              course: {
                id: 3,
                code: 'SC123458',
                name: 'วิทยาการคำนวณ',
                semester: 1,
                year: 2565,
                coverImage: {
                  id: 124,
                  url: 'https://images.unsplash.com/photo-1597008641621-cefdcf718025?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1939&q=80',
                },
                teachers: [
                  {
                    id: 1236,
                    firstName: 'สมศักดิ์',
                    lastName: 'พิทักษ์โลก',
                    username: 'somsak1112',
                    profileImage: {
                      id: 34534,
                      url: 'https://i.pravatar.cc/?u=somsak',
                    },
                  },
                ],
              },
            },
          },
        ],
      })
    );
  }),
  rest.get(`${strapiUrl}/api/classroom/:slug`, (_req, res, ctx) => {
    const { slug } = _req.params;
    if (slug !== 'GfPz2RAAbAEt') {
      return res(
        ctx.status(404),
        ctx.json({
          message: 'Classroom not found.',
        })
      );
    }

    return res(
      ctx.json<ClassroomSlugResponse>({
        id: 1,
        name: 'Section 1',
        slug: 'GfPz2RAAbAEt',
        inviteCode: 'f3a5dd7',
        enabledInviteCode: true,
        teacherAssistants: [
          {
            id: 999,
            firstName: 'Somsak',
            lastName: 'Chicken',
            username: 'somsak999',
            profileImage: {
              id: 213423,
              url: 'https://i.pravatar.cc/?u=somsak999',
            },
          },
        ],
        students: [
          {
            id: 1001,
            firstName: 'Somsri',
            lastName: 'Srisom',
            username: 'somsri007',
            profileImage: {
              id: 54353132,
              url: 'https://i.pravatar.cc/?u=somsri007',
            },
          },
          {
            id: 1002,
            firstName: 'Josh',
            lastName: 'Joose',
            username: 'joshjoose',
            profileImage: {
              id: 6543534,
              url: 'https://i.pravatar.cc/?u=joshjoose',
            },
          },
        ],
        course: {
          id: 1,
          code: 'SC123456',
          name: 'Data Structures',
          semester: 1,
          year: 2565,
          coverImage: {
            id: 123,
            url: 'https://images.unsplash.com/photo-1640158615573-cd28feb1bf4e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
          },
          teachers: [
            {
              id: 1234,
              firstName: 'John',
              lastName: 'Doe',
              username: 'johndoe69',
              profileImage: {
                id: 1,
                url: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=80',
              },
            },
          ],
        },
      })
    );
  }),
  rest.get(`${strapiUrl}/api/courses/me`, (_req, res, ctx) => {
    return res(
      ctx.json<MyCoursesResponse>([
        {
          id: 1,
          code: 'SC123456',
          name: 'Data Structures',
          semester: 1,
          year: 2565,
          slug: 'YXNkZm9ya3Ys',
          coverImage: {
            id: 123,
            url: 'https://images.unsplash.com/photo-1640158615573-cd28feb1bf4e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
          },
          teachers: [
            {
              id: 1234,
              firstName: 'John',
              lastName: 'Doe',
              username: 'johndoe69',
              profileImage: {
                id: 1,
                url: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=80',
              },
            },
          ],
        },
      ])
    );
  }),
  rest.post(`${strapiUrl}/api/course/create`, async (_req, res, ctx) => {
    try {
      const courseData = await _req.json<CreateCourseReq>();

      return res(
        ctx.json({
          message: 'Create course successful.',
          courseData,
        })
      );
    } catch (error) {
      return res(
        ctx.status(403),
        ctx.json({
          message: 'Create course failed.',
        })
      );
    }
  }),
  rest.get(`${strapiUrl}/api/course/:slug`, (_req, res, ctx) => {
    const { slug } = _req.params;
    if (slug !== 'YXNkZm9ya3Ys') {
      return res(
        ctx.status(404),
        ctx.json({
          message: 'Course not found.',
        })
      );
    }

    return res(
      ctx.json<CourseSlugResponse>({
        id: 1,
        code: 'SC123456',
        name: 'Data Structures',
        semester: 1,
        year: 2565,
        slug: 'YXNkZm9ya3Ys',
        coverImage: {
          id: 123,
          url: 'https://images.unsplash.com/photo-1640158615573-cd28feb1bf4e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
        },
        teachers: [
          {
            id: 1234,
            firstName: 'John',
            lastName: 'Doe',
            username: 'johndoe69',
            profileImage: {
              id: 1,
              url: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=80',
            },
          },
        ],
        classrooms: [
          {
            id: 1,
            name: 'Section 1',
            slug: 'GfPz2RAAbAEt',
          },
          {
            id: 12312,
            name: 'Section 2',
            slug: 'hdgxkHO3j5XP',
          },
          {
            id: 12315,
            name: 'Section 3',
            slug: 'g84MVroOk6OC',
          },
        ],
      })
    );
  }),
];
