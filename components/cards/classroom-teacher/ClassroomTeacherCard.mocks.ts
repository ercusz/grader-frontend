import { IClassroomTeacherCard } from './ClassroomTeacherCard';

const base: IClassroomTeacherCard = {
  classroom: {
    id: 3,
    name: 'วิทยาการคำนวณ',
    semester: 1,
    year: 2565,
    section: 3,
    coverImageUrl:
      'https://images.unsplash.com/photo-1597008641621-cefdcf718025?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1939&q=80',
    instructor: {
      id: 1236,
      username: 'somsak1112',
      firstname: 'สมศักดิ์',
      lastname: 'เกรดเด้อ',
      email: 'somsak@kku.edu',
      profile: [
        {
          url: 'https://i.pravatar.cc/',
        },
      ],
    },
    success: 100,
    slug: 'c2dvb2RieWU',
  },
  loading: false,
};

export const mockClassroomTeacherCardProps = {
  base,
};
