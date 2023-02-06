import {
  Assignment,
  ClassroomSlugResponse,
  CourseSlugResponse,
  CreateCourseReq,
  MyClassroomsResponse,
  MyCoursesResponse,
  Post,
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
          {
            id: 1,
            firstName: 'Hello',
            lastName: 'World',
            username: 'custard',
            profileImage: {
              id: 1,
              url: 'http://localhost:1337/uploads/Custard_b537e2fc41.png',
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
  rest.get(`${strapiUrl}/api/classrooms/:id/assignments`, (req, res, ctx) => {
    if (Number(req.params.id) === 1) {
      return res(
        ctx.json<Assignment[]>([
          {
            id: 1,
            classroomId: 1,
            title: 'Lab 1: A+B Problem',
            startDate: new Date().toISOString(),
            endDate: new Date(
              new Date().getTime() + 24 * 60 * 60 * 1000
            ).toISOString(),
            type: 'java-src',
            content: 'test',
            point: 100,
            createdAt: new Date(
              new Date().valueOf() - 1000 * 60 * 60 * 24 * 4
            ).toISOString(),
            createBy: {
              id: 1234,
              firstName: 'John',
              lastName: 'Doe',
              username: 'johndoe69',
              profileImage: {
                id: 1234,
                url: 'https://i.pravatar.cc/?u=john',
              },
            },
            updatedAt: new Date(
              new Date().valueOf() - 1000 * 60 * 60 * 24 * 3
            ).toISOString(),
            updateBy: {
              id: 1235,
              firstName: 'Jane',
              lastName: 'Doe',
              username: 'janedoe69',
              profileImage: {
                id: 1235,
                url: 'https://i.pravatar.cc/?u=jane',
              },
            },
            topic: null,
            enabledPointDeduction: false,
          },
          {
            id: 2,
            classroomId: 1,
            title: 'Lab 2: Grading',
            startDate: new Date(
              new Date().getTime() + 48 * 60 * 60 * 1000
            ).toISOString(),
            endDate: new Date(
              new Date().getTime() + 72 * 60 * 60 * 1000
            ).toISOString(),
            type: 'java-src',
            content: 'test',
            point: 100,
            createdAt: new Date(
              new Date().valueOf() - 1000 * 60 * 60 * 24 * 3
            ).toISOString(),
            createBy: {
              id: 1234,
              firstName: 'John',
              lastName: 'Doe',
              username: 'johndoe69',
              profileImage: {
                id: 1234,
                url: 'https://i.pravatar.cc/?u=john',
              },
            },
            updatedAt: new Date(
              new Date().valueOf() - 1000 * 60 * 60 * 24 * 2
            ).toISOString(),
            updateBy: {
              id: 1235,
              firstName: 'Jane',
              lastName: 'Doe',
              username: 'janedoe69',
              profileImage: {
                id: 1235,
                url: 'https://i.pravatar.cc/?u=jane',
              },
            },
            topic: null,
            enabledPointDeduction: false,
          },
          {
            id: 3,
            classroomId: 1,
            title: 'Lab 3: MinMax',
            startDate: new Date(
              new Date().getTime() + 50 * 60 * 60 * 1000
            ).toISOString(),
            endDate: new Date(
              new Date().getTime() + 72 * 60 * 60 * 1000
            ).toISOString(),
            type: 'java-src',
            content: 'test',
            point: 100,
            createdAt: new Date(
              new Date().valueOf() - 1000 * 60 * 60 * 24 * 2
            ).toISOString(),
            createBy: {
              id: 1234,
              firstName: 'John',
              lastName: 'Doe',
              username: 'johndoe69',
              profileImage: {
                id: 1234,
                url: 'https://i.pravatar.cc/?u=john',
              },
            },
            updatedAt: new Date(
              new Date().valueOf() - 1000 * 60 * 60 * 24 * 2
            ).toISOString(),
            updateBy: null,
            topic: null,
            enabledPointDeduction: false,
          },
          {
            id: 4,
            classroomId: 1,
            title: 'Lecture 1: Flow Chart',
            startDate: new Date(
              new Date().getTime() + 72 * 60 * 60 * 1000
            ).toISOString(),
            endDate: new Date(
              new Date().getTime() + 144 * 60 * 60 * 1000
            ).toISOString(),
            type: 'docs',
            content: 'test',
            point: 100,
            createdAt: new Date(
              new Date().valueOf() - 1000 * 60 * 60 * 24 * 1
            ).toISOString(),
            createBy: {
              id: 1234,
              firstName: 'John',
              lastName: 'Doe',
              username: 'johndoe69',
              profileImage: {
                id: 1234,
                url: 'https://i.pravatar.cc/?u=john',
              },
            },
            updatedAt: new Date(
              new Date().valueOf() - 1000 * 60 * 60 * 24 * 1
            ).toISOString(),
            updateBy: null,
            topic: null,
            enabledPointDeduction: false,
          },
          {
            id: 5,
            classroomId: 1,
            title: 'Lecture 2: ER Diagram',
            startDate: new Date(
              new Date().getTime() + 80 * 60 * 60 * 1000
            ).toISOString(),
            endDate: new Date(
              new Date().getTime() + 48 * 60 * 60 * 1000
            ).toISOString(),
            type: 'docs',
            content: 'test',
            point: 100,
            createdAt: new Date().toISOString(),
            createBy: {
              id: 1234,
              firstName: 'John',
              lastName: 'Doe',
              username: 'johndoe69',
              profileImage: {
                id: 1234,
                url: 'https://i.pravatar.cc/?u=john',
              },
            },
            updatedAt: new Date().toISOString(),
            updateBy: null,
            topic: null,
            enabledPointDeduction: false,
          },
        ])
      );
    }
  }),
  rest.get(`${strapiUrl}/api/assignments/:id`, (req, res, ctx) => {
    const { id } = req.params;
    if (Number(id) !== 1 && Number(id) !== 4) {
      return res(
        ctx.status(404),
        ctx.json({
          message: 'Assignment not found.',
        })
      );
    }

    if (Number(id) === 1) {
      return res(
        ctx.json<Assignment>({
          id: 1,
          classroomId: 1,
          title: 'Lab 1: A+B Problem',
          startDate: new Date(
            new Date().getTime() + 24 * 60 * 60 * 1000
          ).toISOString(),
          endDate: new Date(
            new Date().getTime() + 48 * 60 * 60 * 1000
          ).toISOString(),
          type: 'java-src',
          content: `### Table of contents
  
  ### คำสั่ง
  ให้นักศึกษาเขียนโปรแกรมภาษาจาวาในการคำนวณผลบวกของตัวเลขสองตัว โดยรับอินพุตจากทางหน้าจอ
  
  โดยรับ \`input\` เป็นตัวเลขจํานวนเต็ม \`a\` และ \`b\` จากนั้นให้ \`output\` ผลรวมของตัวเลขทั้ง 2 จํานวนออกทางหน้าจอ
  
  ### ข้อมูลนําเข้า
  
  บรรทัดแรก จํานวนเต็ม \`a\` โดยที่ \`0 ≤ a ≤ 109\`
  
  บรรทัดที่สอง จํานวนเต็ม \`b\` โดยที่ \`0 ≤ b ≤ 109\`
  
  ### ข้อมูลส่งออก
  
  ผลรวม แสดงเป็นตัวเลข เพียงบรรทัดเดียว
  
  ### ตัวอย่างข้อมูลนำเข้า
  
  \`\`\`
  4
  5
  \`\`\`
  
  ### ตัวอย่างข้อมูลส่งออก
  
  \`\`\`
  9
  \`\`\`
  
  \`\`\`java
  import java.io.*;
  import java.util.*;
  
  class Main {
      private static FastInput in = new FastInput(System.in);
      private static PrintWriter out = new PrintWriter(new BufferedOutputStream(System.out));
  
      public static void main(String[] args) {
          int a = in.nextInt();
          int b = in.nextInt();
  
          out.println(a + b);
          out.flush();
      }
  
      static class FastInput {
          BufferedReader br;
          StringTokenizer tok;
  
          public FastInput(InputStream in) {
              br = new BufferedReader(new InputStreamReader(System.in));
              tok = new StringTokenizer("");
          }
  
          public String next() {
              while (!tok.hasMoreTokens()) {
                  try {
                      tok = new StringTokenizer(br.readLine());
                  } catch (IOException e) {
                  }
              }
              return tok.nextToken();
          }
  
          public int nextInt() {
              return Integer.parseInt(next());
          }
  
          public long nextLong() {
              return Long.parseLong(next());
          }
  
          public double nextDouble() {
              return Double.parseDouble(next());
          }
      }
  }
  \`\`\``,
          point: 100,
          createdAt: new Date().toISOString(),
          createBy: {
            id: 1234,
            firstName: 'John',
            lastName: 'Doe',
            username: 'johndoe69',
            profileImage: {
              id: 1234,
              url: 'https://i.pravatar.cc/?u=john',
            },
          },
          updatedAt: new Date(
            new Date().getTime() + 24 * 60 * 60 * 1000
          ).toISOString(),
          updateBy: {
            id: 1235,
            firstName: 'Jane',
            lastName: 'Doe',
            username: 'janedoe69',
            profileImage: {
              id: 1235,
              url: 'https://i.pravatar.cc/?u=jane',
            },
          },
          topic: null,
          enabledPointDeduction: false,
        })
      );
    }

    if (Number(id) === 4) {
      return res(
        ctx.json<Assignment>({
          id: 4,
          classroomId: 1,
          title: 'Lecture 1: Flow Chart',
          startDate: new Date(
            new Date().getTime() + 72 * 60 * 60 * 1000
          ).toISOString(),
          endDate: new Date(
            new Date().getTime() + 144 * 60 * 60 * 1000
          ).toISOString(),
          type: 'docs',
          content: `**คำสั่ง:** ให้นักศึกษาเขียนผังงาน Flowchart ของโจทย์ต่อไปนี้

## โจทย์
จงเขียนโปรแกรมตรวจสอบว่าตัวเลขที่รับเข้ามาเป็น[เลขคู่หรือเลขคี่](https://www.mathsisfun.com/numbers/even-odd.html)

โดยต้องเขียน Flowchart ให้ครบทุกกรณีที่เกิดขึ้นได้ และต้องเขียนเป็นภาษาอังกฤษ

### ข้อมูลนำเข้า

บรรทัดแรก จํานวนเต็ม \`a\` โดยที่ \`0 ≤ a ≤ 109\`

### ข้อมูลส่งออก

ถ้า \`a\` เป็นเลขคู่ให้แสดง \`Even\` ถ้าเป็นเลขคี่ให้แสดง \`Odd\` ทางหน้าจอ เพียงบรรทัดเดียว

เมื่อเขียนเสร็จแล้วให้ส่งไฟล์ในรูปแบบ PDF เท่านั้น`,
          point: 100,
          createdAt: new Date(
            new Date().getTime() + 72 * 60 * 60 * 1000
          ).toISOString(),
          createBy: {
            id: 1234,
            firstName: 'John',
            lastName: 'Doe',
            username: 'johndoe69',
            profileImage: {
              id: 1234,
              url: 'https://i.pravatar.cc/?u=john',
            },
          },
          updatedAt: new Date(
            new Date().getTime() + 72 * 60 * 60 * 1000
          ).toISOString(),
          updateBy: null,
          topic: null,
          enabledPointDeduction: false,
        })
      );
    }
  }),
  rest.get(`${strapiUrl}/api/classrooms/:id/posts`, (req, res, ctx) => {
    if (Number(req.params.id) === 1) {
      return res(
        ctx.json<Post[]>([
          {
            id: 1,
            classroomId: 1,
            content: 'ทดสอบโพสต์ 1',
            isPinned: false,
            createdAt: new Date(
              new Date().valueOf() - 1000 * 60 * 60 * 24 * 4
            ).toISOString(),
            createBy: {
              id: 999,
              firstName: 'Somsak',
              lastName: 'Chicken',
              username: 'somsak999',
              profileImage: {
                id: 213423,
                url: 'https://i.pravatar.cc/?u=somsak999',
              },
            },
            updatedAt: new Date(
              new Date().valueOf() - 1000 * 60 * 60 * 24 * 4
            ).toISOString(),
          },
          {
            id: 2,
            classroomId: 1,
            content:
              'ทดสอบโพสต์ 2 \n บรรทัดที่สอง \n บรรทัดที่สาม \n บรรทัดที่สี่ \n บรรทัดที่ห้า',
            isPinned: true,
            createdAt: new Date(
              new Date().valueOf() - 1000 * 60 * 60 * 24 * 4
            ).toISOString(),
            createBy: {
              id: 1234,
              firstName: 'John',
              lastName: 'Doe',
              username: 'johndoe69',
              profileImage: {
                id: 1,
                url: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=80',
              },
            },
            updatedAt: new Date(
              new Date().valueOf() - 1000 * 60 * 60 * 24 * 3
            ).toISOString(),
          },
          {
            id: 3,
            classroomId: 1,
            content: `Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica.
            
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est commodi qui consequatur nisi eum magnam recusandae impedit aliquid voluptas, voluptatibus officiis labore voluptatum necessitatibus assumenda esse magni! Optio, laudantium eum.`,
            isPinned: false,
            createdAt: new Date(
              new Date().valueOf() - 1000 * 60 * 60 * 24 * 3
            ).toISOString(),
            createBy: {
              id: 1001,
              firstName: 'Somsri',
              lastName: 'Srisom',
              username: 'somsri007',
              profileImage: {
                id: 54353132,
                url: 'https://i.pravatar.cc/?u=somsri007',
              },
            },
            updatedAt: new Date(
              new Date().valueOf() - 1000 * 60 * 60 * 24 * 2
            ).toISOString(),
          },
          {
            id: 4,
            classroomId: 1,
            content: `Hello Test 123`,
            isPinned: false,
            createdAt: new Date().toISOString(),
            createBy: {
              id: 1,
              firstName: 'Hello',
              lastName: 'World',
              username: 'custard',
              profileImage: {
                id: 1,
                url: 'http://localhost:1337/uploads/Custard_b537e2fc41.png',
              },
            },
            updatedAt: new Date().toISOString(),
          },
        ])
      );
    }
  }),
];
