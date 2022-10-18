import { IClassroomInvitationCard } from './ClassroomInvitationCard';

const base: IClassroomInvitationCard = {
  invitation: {
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
  loading: false,
};

export const mockClassroomInvitationCardProps = {
  base,
};
