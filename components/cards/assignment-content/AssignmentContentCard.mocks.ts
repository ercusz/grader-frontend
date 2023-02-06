import { IAssignmentContentCard } from './AssignmentContentCard';

const base: IAssignmentContentCard = {
  assignment: {
    id: 1,
    classroomId: 1,
    title: 'Lab 1: A+B Problem',
    startDate: new Date().toISOString(),
    endDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(),
    type: 'java-src',
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
    updatedAt: new Date(
      new Date().getTime() + 2 * 60 * 60 * 1000
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
};

export const mockAssignmentContentCardProps = {
  base,
};
