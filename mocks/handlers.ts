import { rest } from 'msw';
import { Classroom, Course, CreateCourseReq } from '../types/types';

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_HOST;

export const handlers = [
  rest.get(`${strapiUrl}/api/classrooms/me`, (_req, res, ctx) => {
    return res(
      ctx.json<Classroom[]>([
        {
          id: 1,
          name: 'Data Structures',
          semester: 1,
          year: 2565,
          section: 'Section 2',
          coverImageUrl:
            'https://images.unsplash.com/photo-1640158615573-cd28feb1bf4e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
          instructor: {
            id: 1234,
            username: 'johndoe69',
            email: 'johnny@kku.edu',
            student_id: undefined,
            first_name: 'John',
            last_name: 'Doe',
            role: {
              id: 999999,
              name: 'Teacher',
            },
            profile_img: {
              id: 1,
              url: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=80',
            },
          },
          success: 91.67,
          slug: 'YXNkZm9ya3Ys',
        },
        {
          id: 2,
          name: 'Cyber Security',
          semester: 1,
          year: 2565,
          section: 'กลุ่มการเรียนที่ 1',
          coverImageUrl:
            'https://images.unsplash.com/photo-1504639725590-34d0984388bd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80',
          instructor: {
            id: 1235,
            username: 'bobby',
            email: 'bobby@kku.edu',
            student_id: undefined,
            first_name: 'Albert',
            last_name: 'Bob',
            role: {
              id: 999999,
              name: 'Teacher',
            },
            profile_img: {
              id: 12345,
              url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1780&q=80',
            },
          },
          success: 75,
          slug: 'aGVsbG93b3JsZA',
        },
        {
          id: 3,
          name: 'วิทยาการคำนวณ',
          semester: 1,
          year: 2565,
          section: 'ไก่ทอด',
          coverImageUrl:
            'https://images.unsplash.com/photo-1597008641621-cefdcf718025?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1939&q=80',
          instructor: {
            id: 1236,
            username: 'somsak1112',
            email: 'somsak@kku.edu',
            student_id: undefined,
            first_name: 'สมศักดิ์',
            last_name: 'เกรดเด้อ',
            role: {
              id: 999999,
              name: 'Teacher',
            },
            profile_img: {
              id: 12312,
              url: 'https://i.pravatar.cc/',
            },
          },
          success: 100,
          slug: 'c2dvb2RieWU',
        },
        {
          id: 1333,
          name: 'Database Design',
          semester: 1,
          year: 2565,
          section: 'ไก่ย่าง',
          coverImageUrl:
            'https://images.unsplash.com/photo-1640158615573-cd28feb1bf4e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
          instructor: {
            id: 1234,
            username: 'somsakjung',
            email: 'somsakjung@kku.edu',
            student_id: undefined,
            first_name: 'อัลเบิร์ต',
            last_name: 'สมศักดิ์',
            role: {
              id: 999999,
              name: 'Teacher',
            },
            profile_img: {
              id: 7777,
              url: 'https://i.pravatar.cc/?u=somsak',
            },
          },
          success: 66.67,
          slug: 'somsak-class',
        },
        {
          id: 1334,
          name: 'Data Engineer',
          semester: 1,
          year: 2565,
          section: 'กลุ่มพิเศษ',
          coverImageUrl:
            'https://images.unsplash.com/photo-1640158615573-cd28feb1bf4e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
          instructor: {
            id: 1234,
            username: 'johndoe69',
            email: 'yingkaa91@kku.edu',
            student_id: undefined,
            first_name: 'สมหญิง',
            last_name: 'กระทิงเขียว',
            role: {
              id: 999999,
              name: 'Teacher',
            },
            profile_img: {
              id: 89798,
              url: 'https://i.pravatar.cc/?u=somying',
            },
          },
          success: 18.67,
          slug: 'YXNkZm9ya3Ys',
        },
        {
          id: 1335,
          name: 'Information & Data Security',
          semester: 2,
          year: 2565,
          section: 'ห้องยอดมนุษย์',
          coverImageUrl:
            'https://images.unsplash.com/photo-1640158615573-cd28feb1bf4e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
          instructor: {
            id: 1234,
            username: 'monkey_d_somporn',
            email: 'sompornhub@kku.edu',
            student_id: undefined,
            first_name: 'มังกี้ ดี',
            last_name: 'สมพร',
            role: {
              id: 999999,
              name: 'Teacher',
            },
            profile_img: {
              id: 1234556,
              url: 'https://i.pravatar.cc/?u=somporn',
            },
          },
          success: 18.67,
          slug: 'YXNkZm9ya3Ys',
        },
      ])
    );
  }),
  rest.get(`${strapiUrl}/api/courses/me`, (_req, res, ctx) => {
    return res(
      ctx.json<Course[]>([
        {
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
            student_id: undefined,
            first_name: 'John',
            last_name: 'Doe',
            role: {
              id: 999999,
              name: 'Teacher',
            },
            profile_img: {
              id: 1,
              url: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=80',
            },
          },
          slug: 'YXNkZm9ya3Ys',
        },
        {
          id: 2,
          name: 'System Architecture',
          semester: 1,
          year: 2565,
          section: [
            {
              id: 1,
              name: 'Section 1',
            },
            {
              id: 2,
              name: 'Section พิเศษ',
            },
          ],
          coverImageUrl:
            'https://images.unsplash.com/photo-1617839625591-e5a789593135?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80',
          instructor: {
            id: 1234,
            username: 'johndoe69',
            email: 'johnny@kku.edu',
            student_id: undefined,
            first_name: 'John',
            last_name: 'Doe',
            role: {
              id: 999999,
              name: 'Teacher',
            },
            profile_img: {
              id: 1,
              url: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=80',
            },
          },
          slug: '0TQlAocpPeBC',
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
      ctx.json<Course>({
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
          student_id: undefined,
          first_name: 'John',
          last_name: 'Doe',
          role: {
            id: 999999,
            name: 'Teacher',
          },
          profile_img: {
            id: 1,
            url: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=80',
          },
        },
        slug: 'YXNkZm9ya3Ys',
      })
    );
  }),
];
